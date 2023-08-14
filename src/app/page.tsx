'use client'

import { Input, Operator, Output, Stream } from '@/components'
import { NodeStatus, NodeVariants, StreamStatus } from '@/constants'
import { useStream } from '@/hooks'
import { initial } from '@/mocks'
import styles from '@/styles/app.module.css'
import { NodeProps, StreamProps } from '@/types'
import { ChangeEvent, PointerEvent, useState } from 'react'

export default function Home() {
  const [nodes, setNodes] = useState<NodeProps[]>(initial)
  const [streams, setStreams] = useState<StreamProps[]>([])
  const { activeStream, transmitter, reciever, linkedStreams } = useStream(streams, nodes)

  function handleInputValueChange(event: ChangeEvent<HTMLInputElement>, nodeId: string) {
    const newNodeValues = nodes.map((node) => {
      if (node.id !== nodeId) return node
      return { ...node, value: Number(event.currentTarget.value) }
    })
    setNodes(newNodeValues)
  }

  function handleOutputPointerDown(event: PointerEvent<HTMLButtonElement>, nodeId: string) {
    const newNodeStatus = nodes.map((node) => {
      if (node.id !== nodeId) return node
      return { ...node, status: NodeStatus.Searching }
    })
    setNodes(newNodeStatus)
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = [
      ...streams,
      {
        id: crypto.randomUUID(),
        from: `${x + width / 2} ${y + height / 2}`,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Active,
        transmitterId: nodeId,
      },
    ] as StreamProps[]
    setStreams(newStreams)
  }

  function handleInputPointerUp(event: PointerEvent<HTMLButtonElement>, sourceNode: NodeProps) {
    event.stopPropagation()
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const LinkActiveStream = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return {
        ...stream,
        status: StreamStatus.Linked,
        to: `${x + width / 2} ${y + height / 2}`,
        recieverId: sourceNode.id,
      }
    })
    setStreams(LinkActiveStream)
  }

  function handleMainPointerMove(event: PointerEvent<HTMLElement>) {
    if (streams.length === 0) return
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return { ...stream, to: `${event.clientX} ${event.clientY}` }
    })
    setStreams(newStreams)
  }

  function handleMainPointerUp() {
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Searching) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    if (streams.length === 0) return
    const newStreams = streams.filter((stream) => stream.status === StreamStatus.Linked)
    setNodes(newNodes)
    setStreams(newStreams)
  }
  return (
    <main className={styles.main} onPointerMove={handleMainPointerMove} onPointerUp={handleMainPointerUp}>
      {nodes.map((node) => {
        switch (node.variant) {
          case NodeVariants.Input:
            return <Input {...node} key={node.id} onInputValueChange={() => {}} onOutputPointerDown={() => {}} />
          case NodeVariants.Operator:
            return <Operator {...node} key={node.id} onInputPointerUp={() => {}} onOutputPointerDown={() => {}} />
          case NodeVariants.Output:
            return <Output {...node} key={node.id} onInputPointerUp={() => {}} />
          default:
            return null
        }
      })}
      <svg className={styles.svg} xmlns='http://www.w3.org/2000/svg'>
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </main>
  )
}
