import { CanvasContextMenu } from '@/components/canvas.context.menu'
import { Node } from '@/components/node'
import { Stream } from '@/components/stream'
import { useCanvas, useCanvasDispatch } from '@/hooks/canvas.context'
import styles from '@/styles/canvas.module.css'
import { CanvasActionType } from '@/types/canvas.context'
import { useState, type MouseEvent, type PointerEvent } from 'react'

export function Canvas() {
  const { nodes } = useCanvas()
  const { streams } = useCanvas()
  const dispatch = useCanvasDispatch()
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  })

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault()
    setContextMenuOpen(true)
    setContextMenuPosition({ x: event.clientX, y: event.clientY })
  }

  function handleNumberNodeClick(event: MouseEvent<HTMLButtonElement>) {
    setContextMenuOpen(false)
    dispatch({
      type: CanvasActionType.CREATE_NUMBER_NODE,
      payload: { ...event },
    })
  }

  function handleOperatorNodeClick(event: MouseEvent<HTMLButtonElement>) {
    setContextMenuOpen(false)
    dispatch({
      type: CanvasActionType.CREATE_OPERATOR_NODE,
      payload: { ...event },
    })
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionType.DRAG_SELECTION,
      payload: { ...event },
    })
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionType.DROP_SELECTION,
      payload: { ...event },
    })
  }

  return (
    <main
      className={styles.main}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => dispatch({ type: CanvasActionType.LEAVE_CANVAS })}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenuOpen(false)}
    >
      {nodes.length === 0 ? (
        <p className={styles.gettingStartedText}>Right click to add a node</p>
      ) : null}
      {nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      <svg className={styles.svg} preserveAspectRatio='xMinYMin meet'>
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
      {contextMenuOpen ? (
        <CanvasContextMenu
          contextMenuPosition={contextMenuPosition}
          onNumberNodeClick={handleNumberNodeClick}
          onOperatorNodeClick={handleOperatorNodeClick}
        />
      ) : null}
    </main>
  )
}
