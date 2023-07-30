import CanvasContextMenu from '@/components/canvas.context.menu'
import Node from '@/components/node'
import Stream from '@/components/stream'
import { useCanvas, useCanvasDispatch } from '@/hooks/canvas.context'
import styles from '@/styles/canvas.module.css'
import { CanvasActionType, CanvasContextMenuStatus } from '@/types/canvas'
import { NodeVariant } from '@/types/node'
import type { Coordinate } from '@/types/utility'
import { useState, type MouseEvent, type PointerEvent } from 'react'

export default function Canvas() {
  const dispatch = useCanvasDispatch()
  const { nodes, streams } = useCanvas()
  const [canvasContextMenu, setCanvasContextMenu] = useState({
    status: CanvasContextMenuStatus.Closed,
    position: { x: 0, y: 0 },
  })

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault()
    setCanvasContextMenu({
      status: CanvasContextMenuStatus.Open,
      position: { x: event.clientX, y: event.clientY },
    })
  }

  function handleCanvasContextMenuItemClick(
    event: MouseEvent<HTMLButtonElement>
  ) {
    const { value } = event.currentTarget
    setCanvasContextMenu({
      ...canvasContextMenu,
      status: CanvasContextMenuStatus.Closed,
    })
    dispatch({
      type: CanvasActionType.CreateNode,
      payload: {
        nodeVariant: value as NodeVariant,
        nodePosition: canvasContextMenu.position,
      },
    })
  }

  function handleCanvasClick() {
    setCanvasContextMenu({
      ...canvasContextMenu,
      status: CanvasContextMenuStatus.Closed,
    })
  }

  function handleCanvasPointerUp() {
    dispatch({ type: CanvasActionType.DropOnCanvas })
  }

  function handleCanvasPointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionType.MoveOnCanvas,
      payload: {
        canvasPointerPosition: { x: event.clientX, y: event.clientY },
      },
    })
  }

  function handleNodePointerDown(nodeId: string, nodePosition: Coordinate) {
    dispatch({
      type: CanvasActionType.SelectNode,
      payload: { nodeId: nodeId, nodePosition: nodePosition },
    })
  }

  function handleNodePointerUp() {
    dispatch({ type: CanvasActionType.DropOnCanvas })
  }

  function handleNodeValueChange(nodeId: string, nodeValue: number) {
    dispatch({
      type: CanvasActionType.UpdateNodeValue,
      payload: { nodeId: nodeId, nodeValue: nodeValue },
    })
  }

  function handleOutputPortPointerUp(
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) {}
  function handleOutputPortPointerDown(
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) {
    dispatch({
      type: CanvasActionType.CreateStream,
      payload: { nodeId: nodeId, portId: portId, portBounds: portBounds },
    })
  }

  function handleInputPortPointerDown(
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) {}
  function handleInputPortPointerUp(
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) {
    dispatch({
      type: CanvasActionType.LinkStream,
      payload: { nodeId: nodeId, portId: portId, portBounds: portBounds },
    })
  }

  return (
    <main
      className={styles.main}
      onContextMenu={handleContextMenu}
      onClick={handleCanvasClick}
      onPointerUp={handleCanvasPointerUp}
      onPointerMove={handleCanvasPointerMove}
    >
      {nodes.map((node) => (
        <Node
          key={node.id}
          onNodePointerDown={handleNodePointerDown}
          onNodePointerUp={handleNodePointerUp}
          onNodeValueChange={handleNodeValueChange}
          onInputPortPointerDown={handleInputPortPointerDown}
          onInputPortPointerUp={handleInputPortPointerUp}
          onOutputPortPointerDown={handleOutputPortPointerDown}
          onOutputPortPointerUp={handleOutputPortPointerUp}
          {...node}
        />
      ))}
      {nodes.length === 0 ? (
        <p className={styles.startup}>Right Click To Add A Node</p>
      ) : null}
      {streams.length > 0 ? (
        <svg className={styles.svg}>
          {streams.map((stream) => (
            <Stream key={stream.id} {...stream} />
          ))}
        </svg>
      ) : null}
      {canvasContextMenu.status === CanvasContextMenuStatus.Open ? (
        <CanvasContextMenu
          contextMenuPosition={canvasContextMenu.position}
          onCanvasContextMenuItemCLick={(event) =>
            handleCanvasContextMenuItemClick(event)
          }
        />
      ) : null}
    </main>
  )
}
