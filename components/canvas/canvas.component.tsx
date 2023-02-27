import type { MouseEvent, PointerEvent } from "react";
import { useState } from "react";
import { ActionType, useCanvas, useCanvasDispatch } from "../../hooks";
import styles from "./canvas.module.css";
import { Menu } from "./menus";
import { Node } from "./nodes";
import { Stream } from "./streams";

export function Canvas() {
  const { nodes, streams } = useCanvas();
  const dispatch = useCanvasDispatch();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({ type: ActionType.CANVAS_POINTER_MOVE, payload: { ...event } });
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    dispatch({ type: ActionType.CANVAS_POINTER_UP, payload: { ...event } });
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    dispatch({ type: ActionType.PORT_POINTER_LEAVE, payload: { ...event } });
  }

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
  }

  function handleNumberNodeClick(event: MouseEvent<HTMLButtonElement>) {
    dispatch({
      type: ActionType.CREATE_NUMBER_NODE,
      payload: { ...event },
    });
    setContextMenuOpen(false);
  }

  function handleOperatorNodeClick(event: MouseEvent<HTMLButtonElement>) {
    dispatch({
      type: ActionType.CREATE_OPERATOR_NODE,
      payload: { ...event },
    });
    setContextMenuOpen(false);
  }
  return (
    <main
      className={styles.main}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenuOpen(false)}
    >
      {nodes.length === 0 && (
        <p style={{ opacity: 0.33, textAlign: "center" }}>
          Right click to add a node
        </p>
      )}

      {nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}

      <svg
        className={styles.streams}
        height={"100%"}
        width={"100%"}
        preserveAspectRatio="xMinYMin meet"
      >
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
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
