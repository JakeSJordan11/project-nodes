'use client'

import { Node } from '@/components/node'
import { Port } from '@/components/port'
import { Stream } from '@/components/stream'
import { mockNodes } from '@/mock/data'
import styles from '@/styles/app.module.css'
import { NodeProps, NodeStatus } from '@/types/node'
import { StreamProps, StreamStatus } from '@/types/stream'
import { ChangeEvent, PointerEvent, useState } from 'react'

export default function Application() {
  const [nodes, setNodes] = useState<NodeProps[]>(mockNodes)
  const [streams, setStreams] = useState<StreamProps[]>([])

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
      if (node.status !== NodeStatus.Linking) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    const newStreams = streams.filter(
      (stream) => stream.status === StreamStatus.Linked
    )
    setNodes(newNodes)
    setStreams(newStreams)
  }

  function handleNodeValueChange(
    event: ChangeEvent<HTMLInputElement>,
    nodeId: string
  ) {
    const newNodes = [...nodes]
    const nodeIndex = newNodes.findIndex((node) => node.id === nodeId)
    newNodes[nodeIndex].value = Number(event.currentTarget.value)
    setNodes(newNodes)
  }

  function handlePortPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) {
    setNodes(
      nodes.map((node) => {
        if (node.id !== nodeId) return node
        return {
          ...node,
          status: NodeStatus.Linking,
        }
      })
    )
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    setStreams([
      ...streams,
      {
        id: crypto.randomUUID(),
        from: `${x + width / 2} ${y + height / 2}`,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Active,
      },
    ])
  }

  function handlePortPointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation()
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Linking) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    setNodes(newNodes)
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return {
        ...stream,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Linked,
      }
    })
    setStreams(newStreams)
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      {nodes.map((node) => (
        <Node
          key={node.id}
          {...node}
          onNodeValueChange={handleNodeValueChange}
          onPortPointerDown={handlePortPointerDown}
          onPortPointerUp={handlePortPointerUp}
        />
      ))}
      <svg className={styles.svg} xmlns='http://www.w3.org/2000/svg'>
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </main>
  )
}
