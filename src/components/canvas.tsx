import CanvasContextMenu from '@/components/canvas.context.menu'
import Node from '@/components/node'
import Stream from '@/components/stream'
import { useNodes, useNodesDispatch } from '@/hooks/nodes.context'
import { useStreams } from '@/hooks/streams.context'
import styles from '@/styles/canvas.module.css'
import { NodeActionType, NodeVariant } from '@/types/node'
import { assert } from 'console'
import { hkdf } from 'crypto'
import {
  Familjen_Grotesk,
  Fanwood_Text,
  Noto_Sans_Medefaidrin,
} from 'next/font/google'
import { MouseEvent, useState, type PointerEvent } from 'react'

export default function Canvas() {
  const nodes = useNodes()
  const streams = useStreams()
  const nodesDispatch = useNodesDispatch()
  const [canvasContextMenuOpen, setCanvasContextMenuOpen] = useState(false)
  const [canvasContextMenuPosition, setCanvasContextMenuPosition] = useState({
    x: 0,
    y: 0,
  })

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault()
    setCanvasContextMenuOpen(true)
    setCanvasContextMenuPosition({ x: event.clientX, y: event.clientY })
  }

  function handleCanvasContextMenuItemClick(
    event: MouseEvent<HTMLButtonElement>
  ) {
    const { value } = event.currentTarget
    setCanvasContextMenuOpen(false)
    nodesDispatch({
      type: NodeActionType.CreateNode,
      payload: {
        variant: value as NodeVariant,
        position: canvasContextMenuPosition,
      },
    })
  }

  function handleCanvasClick() {
    setCanvasContextMenuOpen(false)
  }

  return (
    <main
      className={styles.main}
      onContextMenu={handleContextMenu}
      onClick={handleCanvasClick}
    >
      {nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      {nodes.length <= 0 ? (
        <p className={styles.startup}>Right Click To Add A Node</p>
      ) : null}
      {streams.length > 0 ? (
        <svg className={styles.svg}>
          {streams.map((stream) => (
            <Stream key={stream.id} {...stream} />
          ))}
        </svg>
      ) : null}
      {canvasContextMenuOpen ? (
        <CanvasContextMenu
          contextMenuPosition={canvasContextMenuPosition}
          onCanvasContextMenuItemCLick={(event) =>
            handleCanvasContextMenuItemClick(event)
          }
        />
      ) : null}
    </main>
  )
}
