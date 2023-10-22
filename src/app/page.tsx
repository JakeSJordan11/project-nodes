'use client'

import { AdditionNode } from '@/components/addition.node'
import { ContextMenu } from '@/components/context.menu'
import { IntegerNode } from '@/components/integer.node'
import { OutputNode } from '@/components/output.node'
import { Stream } from '@/components/stream'
import styles from '@/styles/page.module.css'
import { ContextMenuStatus } from '@/types/context.menu'
import { Node, NodeType } from '@/types/node'
import { StreamProps, StreamStatus } from '@/types/stream'
import { randomUUID } from 'crypto'
import { PointerEvent, useState } from 'react'

export default function Home() {
  const [streams, setStreams] = useState<StreamProps[]>([])
  const [nodes, setNodes] = useState<Node[]>([])
  const [contextMenu, setContextMenu] = useState({
    position: { x: 0, y: 0 },
    status: ContextMenuStatus.Hidden,
  })

  function handleMainPointerMove(event: PointerEvent<HTMLElement>) {
    if (streams.length === 0) return
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return { ...stream, l: `${event.clientX} ${event.clientY}` }
    })
    setStreams(newStreams)
  }

  function handleMainPointerUp() {
    const newStreams = streams.filter(
      (stream) => stream.status === StreamStatus.Linked
    )
    setStreams(newStreams)
  }

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault()
    if (contextMenu.status === ContextMenuStatus.Visible) {
      setContextMenu({
        position: { x: 0, y: 0 },
        status: ContextMenuStatus.Hidden,
      })
    } else if (contextMenu.status === ContextMenuStatus.Hidden) {
      setContextMenu({
        position: { x: event.clientX, y: event.clientY },
        status: ContextMenuStatus.Visible,
      })
    } else return null
  }

  function handleItemPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.value === 'IntegerNode') {
      const newNodes = [
        ...nodes,
        {
          id: crypto.randomUUID(),
          type: NodeType.Integer,
          position: { x: event.clientX, y: event.clientY },
        },
      ]
      setNodes(newNodes)
    }
    if (event.currentTarget.value === 'AdditionNode') {
      const newNodes = [
        ...nodes,
        {
          id: crypto.randomUUID(),
          type: NodeType.Addition,
          position: { x: event.clientX, y: event.clientY },
        },
      ]
      setNodes(newNodes)
    }
    if (event.currentTarget.value === 'OutputNode') {
      const newNodes = [
        ...nodes,
        {
          id: crypto.randomUUID(),
          type: NodeType.Output,
          position: { x: event.clientX, y: event.clientY },
        },
      ]
      setNodes(newNodes)
    }
    setContextMenu({
      position: { x: 0, y: 0 },
      status: ContextMenuStatus.Hidden,
    })
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
      onContextMenu={handleContextMenu}
    >
      {contextMenu.status === ContextMenuStatus.Visible ? (
        <ContextMenu
          position={contextMenu.position}
          onItemPointerDown={handleItemPointerDown}
        />
      ) : null}
      {nodes.map((node) => {
        switch (node.type) {
          case NodeType.Integer:
            return <IntegerNode key={node.id} {...node} />
          case NodeType.Addition:
            return <AdditionNode key={node.id} {...node} />
          case NodeType.Output:
            return <OutputNode key={node.id} {...node} />
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
