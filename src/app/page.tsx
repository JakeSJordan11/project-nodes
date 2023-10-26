'use client'

import { ContextMenu } from '@/components/context.menu'
import { Node } from '@/components/node'
import { Stream } from '@/components/stream'
import styles from '@/styles/page.module.css'
import { ContextMenuStatus } from '@/types/context.menu'
import {
  NodeKind,
  NodeProps,
  NodeState,
  NodeStatus,
  NodeVariant,
} from '@/types/node'
import { PortKind, PortState, PortStatus } from '@/types/port'
import { StreamProps, StreamStatus } from '@/types/stream'
import { ChangeEvent, PointerEvent, useState } from 'react'

export default function Home() {
  const [streams, setStreams] = useState<StreamProps[]>([])
  const [nodes, setNodes] = useState<NodeState[]>([])
  const [contextMenu, setContextMenu] = useState({
    position: { x: 0, y: 0 },
    status: ContextMenuStatus.Hidden,
  })

  function getPortById(id: string) {
    return nodes
      .map((node) => node.ports)
      .flat()
      .find((port) => port.id === id) as PortState
  }

  function handleMainPointerMove(event: PointerEvent<HTMLElement>) {
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Active) return node
      return {
        ...node,
        position: {
          x: event.clientX - node.offset.x,
          y: event.clientY - node.offset.y,
        },
      }
    })
    setNodes(newNodes)
    if (streams.length === 0) return
    const newStreams = streams.map((stream) => {
      if (stream.status === StreamStatus.Active) {
        return { ...stream, l: `${event.clientX} ${event.clientY}` }
      } else if (stream.status === StreamStatus.Linked) {
        const {
          x: sx,
          y: sy,
          width: sw,
          height: sh,
        } = stream.source.getBoundingClientRect()
        const {
          x: tx,
          y: ty,
          width: tw,
          height: th,
        } = stream.target?.getBoundingClientRect() as DOMRect
        return {
          ...stream,
          m: `${sx + sw * 0.5} ${sy + sh * 0.5}`,
          l: `${tx + tw * 0.5} ${ty + th * 0.5}`,
        }
      } else return stream
    })
    setStreams(newStreams)
  }

  function handleMainPointerUp() {
    const newStreams = streams.filter(
      (stream) => stream.status === StreamStatus.Linked
    )
    setStreams(newStreams)
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Active) return node
      return { ...node, status: NodeStatus.Idle }
    })
    setNodes(newNodes)
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
        position: { x: event.clientX - 75, y: event.clientY - 10 },
        status: ContextMenuStatus.Visible,
      })
    } else return null
  }

  function calculateNodeKind(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return NodeKind.Input
    if (textContent === NodeVariant.Addition) return NodeKind.Operator
    return NodeKind.Output
  }

  function calculateNodeVariant(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return NodeVariant.Integer
    return NodeVariant.Addition
  }

  function calculateNodeTitle(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return NodeVariant.Integer
    return NodeVariant.Addition
  }

  function calculateNodeValue(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return 0
  }

  function calculateNodePosition(clientX: number, clientY: number) {
    return { x: clientX - 75, y: clientY - 10 }
  }

  function calculateNodeStatus(textContent: string | null) {
    return NodeStatus.Idle
  }

  function calculatePorts(textContent: string | null) {
    if (textContent === NodeVariant.Integer) {
      return [
        {
          id: crypto.randomUUID(),
          kind: PortKind.Output,
          value: 0,
          status: PortStatus.Idle,
        },
      ]
    }
    if (textContent === NodeVariant.Addition) {
      return [
        {
          id: crypto.randomUUID(),
          kind: PortKind.Input,
          status: PortStatus.Idle,
        },
        {
          id: crypto.randomUUID(),
          kind: PortKind.Input,
          status: PortStatus.Idle,
        },
        {
          id: crypto.randomUUID(),
          kind: PortKind.Output,
          status: PortStatus.Idle,
        },
      ]
    }
    return []
  }

  function handleItemPointerDown(event: PointerEvent<HTMLButtonElement>) {
    const { textContent } = event.currentTarget
    const { clientX, clientY } = event
    const newNodes = [
      ...nodes,
      {
        id: crypto.randomUUID(),
        kind: calculateNodeKind(textContent),
        variant: calculateNodeVariant(textContent),
        title: calculateNodeTitle(textContent),
        value: calculateNodeValue(textContent),
        position: calculateNodePosition(clientX, clientY),
        status: calculateNodeStatus(textContent),
        ports: calculatePorts(textContent),
        offset: calculateNodePosition(clientX, clientY),
      },
    ]
    setNodes(newNodes)
    setContextMenu({
      ...contextMenu,
      status: ContextMenuStatus.Hidden,
    })
  }

  function handleNodePointerDown(event: PointerEvent<HTMLElement>) {
    const newNodes = nodes.map((node) => {
      if (node.id !== event.currentTarget.id) return node
      const bounds = event.currentTarget.getBoundingClientRect()
      return {
        ...node,
        status: NodeStatus.Active,
        offset: {
          x: event.clientX - bounds.x,
          y: event.clientY - bounds.y,
        },
      }
    })
    setNodes(newNodes)
  }

  function handlePortPointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation()
    const port = getPortById(event.currentTarget.id)
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    if (port.id === event.currentTarget.id) {
      const newStreams = [
        ...streams,
        {
          id: crypto.randomUUID(),
          value: port.value,
          m: `${x + width * 0.5} ${y + height * 0.5}`,
          l: `${x + width * 0.5} ${y + height * 0.5}`,
          status: StreamStatus.Active,
          source: event.currentTarget as HTMLButtonElement,
        },
      ]
      setStreams(newStreams)
    }
  }

  function handlePortPointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation()
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return {
        ...stream,
        l: `${x + width * 0.5} ${y + height * 0.5}`,
        status: StreamStatus.Linked,
        target: event.currentTarget as HTMLButtonElement,
      }
    })
    setStreams(newStreams)

    const port = getPortById(event.currentTarget.id)
    const newNodes = nodes.map((node) => {
      if (port.id === event.currentTarget.id) {
        return {
          ...node,
          ports: node.ports.map((port) => {
            return {
              ...port,
              status: streams.find(
                (stream) =>
                  (stream.status === StreamStatus.Active &&
                    stream.source.id === port.id) ||
                  event.currentTarget.id === port.id
              )
                ? PortStatus.Linked
                : PortStatus.Idle,

              value: streams.find(
                (stream) =>
                  (stream.status === StreamStatus.Active &&
                    stream.source.id === port.id) ||
                  event.currentTarget.id === port.id
              )
                ? streams.find(
                    (stream) =>
                      (stream.status === StreamStatus.Active &&
                        stream.source.id === port.id) ||
                      event.currentTarget.id === port.id
                  )?.value
                : port.value,
            }
          }),
        }
      }
    }) as NodeProps[]
    setNodes(newNodes)
  }

  function handleValueChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.currentTarget
    const newNodes = nodes.map((node) => {
      if (node.id !== event.currentTarget.parentElement?.id) return node
      return {
        ...node,
        value: node.variant === NodeVariant.Boolean ? checked : value,
        ports: node.ports.map((port) => {
          return {
            ...port,
            value: node.variant === NodeVariant.Boolean ? checked : value,
          }
        }),
      }
    }) as NodeProps[]
    setNodes(newNodes)
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
      onContextMenu={handleContextMenu}
      onPointerLeave={handleMainPointerUp}
    >
      {contextMenu.status === ContextMenuStatus.Visible ? (
        <ContextMenu
          {...contextMenu}
          position={contextMenu.position}
          onItemPointerDown={handleItemPointerDown}
        />
      ) : null}
      {nodes.map((node) => (
        <Node
          {...node}
          key={node.id}
          onNodePointerDown={handleNodePointerDown}
          onPortPointerDown={handlePortPointerDown}
          onPortPointerUp={handlePortPointerUp}
          onValueChange={handleValueChange}
        />
      ))}
      <svg className={styles.svg} xmlns='http://www.w3.org/2000/svg'>
        {streams.map((stream) => (
          <Stream {...stream} key={stream.id} />
        ))}
      </svg>
    </main>
  )
}
