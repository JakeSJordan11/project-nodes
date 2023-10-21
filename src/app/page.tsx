'use client'

import { Node } from '@/components/node'
import { Stream } from '@/components/stream'
import { mockNodes } from '@/mock/data'
import styles from '@/styles/app.module.css'
import { NodeProps } from '@/types/node'
import { StreamProps, StreamStatus } from '@/types/stream'
import { ChangeEvent, PointerEvent, useState } from 'react'

export default function Application() {
  const [nodes, setNodes] = useState(mockNodes)
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
    const newStreams = streams.filter(
      (stream) => stream.status === StreamStatus.Linked
    )
    setStreams(newStreams)
  }

  function handleNodeValueChange(
    event: ChangeEvent<HTMLInputElement>,
    nodeId: string
  ) {
    const targetPortId = streams.find(
      (stream) =>
        stream.status === StreamStatus.Linked && stream.sourceNodeId === nodeId
    )?.targetPortId
    const newStreams = streams.map((stream) => {
      if (stream.sourceNodeId !== nodeId) return stream
      return { ...stream, value: Number(event.target.value) }
    })
    setStreams(newStreams)
    const newPortValues = nodes.map((node) => {
      if (nodeId === node.id) {
        return {
          ...node,
          value: Number(event.currentTarget.value),
        }
      } else if (targetPortId === node.inputId) {
        return {
          ...node,
          inputValue: Number(event.currentTarget.value),
        }
      } else if (targetPortId === node.input1Id) {
        return {
          ...node,
          input1Value: Number(event.currentTarget.value),
        }
      } else if (targetPortId === node.input2Id) {
        return {
          ...node,
          input2Value: Number(event.currentTarget.value),
        }
      } else if (targetPortId === node.inputId) {
        return {
          ...node,
          input3Value: Number(event.currentTarget.value),
        }
      } else return node
    })
    setNodes(newPortValues)
  }

  function handlePortPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) {
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    setStreams([
      ...streams,
      {
        value: Number(event.currentTarget.value),
        id: crypto.randomUUID(),
        from: `${x + width / 2} ${y + height / 2}`,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Active,
        sourcePortId: event.currentTarget.id,
        targetPortId: '',
        sourceNodeId: nodeId,
        targetNodeId: '',
      },
    ])
  }

  function handlePortPointerUp(
    event: PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) {
    event.stopPropagation()
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return {
        ...stream,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Linked,
        targetPortId: event.currentTarget.id,
        targetNodeId: nodeId,
      }
    })
    setStreams(newStreams)
    const activeStreamValue = streams.find(
      (stream) => stream.status === StreamStatus.Active
    )?.value
    const newInputValues = nodes.map((node) => {
      if (!activeStreamValue) return node
      if (event.currentTarget.id === node.inputId) {
        return {
          ...node,
          inputValue: activeStreamValue,
        } as NodeProps
      } else if (event.currentTarget.id === node.input1Id) {
        return {
          ...node,
          input1Value: activeStreamValue,
        } as NodeProps
      } else if (event.currentTarget.id === node.input2Id) {
        return {
          ...node,
          input2Value: activeStreamValue,
        } as NodeProps
      } else return node
    })
    setNodes(newInputValues)
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      {nodes.map((node) => (
        <Node
          {...node}
          key={node.id}
          onNodeValueChange={(event) => handleNodeValueChange(event, node.id)}
          onPortPointerDown={(event) => handlePortPointerDown(event, node.id)}
          onPortPointerUp={(event) => handlePortPointerUp(event, node.id)}
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
