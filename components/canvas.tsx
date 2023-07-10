import type { MouseEvent, PointerEvent } from "react";
import { useState } from "react";
import { Menu, Nodes, Streams } from "../components";
import { useCanvas, useCanvasDispatch } from "../hooks";
import styles from "../styles/canvas.module.css";
import { CanvasActionType } from "../types";

export function Canvas() {
  const { nodes } = useCanvas();
  const dispatch = useCanvasDispatch();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault();
    !nodes.find((node) => node.isActive) && setContextMenuOpen(true),
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
  }

  function handleNumberNodeClick(event: MouseEvent<HTMLButtonElement>) {
    setContextMenuOpen(false);
    dispatch({
      type: CanvasActionType.CREATE_NUMBER_NODE,
      payload: { ...event },
    });
  }

  function handleOperatorNodeClick(event: MouseEvent<HTMLButtonElement>) {
    setContextMenuOpen(false);
    dispatch({
      type: CanvasActionType.CREATE_OPERATOR_NODE,
      payload: { ...event },
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionType.DRAG_SELECTION,
      payload: { ...event },
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionType.DROP_SELECTION,
      payload: { ...event },
    });
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
      {nodes.length === 0 && <GettingStarted />}
      <Nodes />
      <Streams />
      {contextMenuOpen && (
        <Menu
          contextMenuPosition={contextMenuPosition}
          onNumberNodeClick={handleNumberNodeClick}
          onOperatorNodeClick={handleOperatorNodeClick}
        />
      )}
    </main>
  );
}

function GettingStarted() {
  return <p className={styles.gettingStartedText}>Right click to add a node</p>;
}
