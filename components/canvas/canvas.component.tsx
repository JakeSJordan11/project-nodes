import type { MouseEvent, PointerEvent } from "react";
import { useState } from "react";
import { CanvasActionType, useCanvas, useCanvasDispatch } from "../../hooks";
import styles from "./canvas.module.css";
import { Menu } from "./menu";
import { Node } from "./node";
import { Stream } from "./stream";

export function Canvas() {
  const { nodes, streams } = useCanvas();
  const dispatch = useCanvasDispatch();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
  }

  function handleNumberNodeClick(event: MouseEvent<HTMLButtonElement>) {
    dispatch({
      type: CanvasActionType.CREATE_NUMBER_NODE,
      payload: { ...event },
    });
    setContextMenuOpen(false);
  }

  function handleOperatorNodeClick(event: MouseEvent<HTMLButtonElement>) {
    dispatch({
      type: CanvasActionType.CREATE_OPERATOR_NODE,
      payload: { ...event },
    });
    setContextMenuOpen(false);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionType.DRAG_SELECTION,
      payload: { ...event },
    });
  }
  return (
    <main
      className={styles.main}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => dispatch({ type: CanvasActionType.DROP_SELECTION })}
      onPointerUp={() => dispatch({ type: CanvasActionType.DROP_SELECTION })}
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
