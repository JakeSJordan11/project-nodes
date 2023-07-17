import { CanvasContextMenu } from "@/components/canvas.contextmenu";
import { NumberNode } from "@/components/number.node";
import { OperatorNode } from "@/components/operator.node";
import { Stream } from "@/components/stream";
import { CanvasActionTypes } from "@/constants/canvas.reducer";
import { nodeTypes } from "@/constants/node";
import { useCanvas, useCanvasDispatch } from "@/hooks/canvas.context";
import styles from "@/styles/canvas.module.css";
import type { MouseEvent, PointerEvent } from "react";
import { useState } from "react";

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
    setContextMenuOpen(true);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  }

  function handleCreateNumberNode(event: MouseEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionTypes.CreateNode,
      payload: {
        type: nodeTypes.number,
        x:
          event.clientX - event.currentTarget.getBoundingClientRect().width / 2,
        y:
          event.clientY -
          event.currentTarget.getBoundingClientRect().height / 2,
      },
    });
  }

  function handleCreateOperatorNode(event: MouseEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionTypes.CreateNode,
      payload: {
        type: nodeTypes.operator,
        x:
          event.clientX - event.currentTarget.getBoundingClientRect().width / 2,
        y:
          event.clientY -
          event.currentTarget.getBoundingClientRect().height / 2,
      },
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionTypes.DragSelection,
      payload: {
        id: event.currentTarget.id,
        x: event.clientX,
        y: event.clientY,
      },
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionTypes.DropSelection,
      payload: {
        id: event.currentTarget.id,
        x: event.clientX,
        y: event.clientY,
      },
    });
  }

  return (
    <main
      className={styles.main}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenuOpen(false)}
    >
      {nodes.length === 0 && (
        <p className={styles.gettingStartedText}>Right click to add a node</p>
      )}
      <>
        {nodes.map((node) => {
          switch (node.type) {
            case "number":
              return <NumberNode key={node.id} {...node} />;
            case "operator":
              return <OperatorNode key={node.id} {...node} />;
            default:
              break;
          }
        })}
      </>
      <svg className={styles.svg} preserveAspectRatio="xMinYMin meet">
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
      {contextMenuOpen && (
        <CanvasContextMenu
          contextMenuPosition={contextMenuPosition}
          onNumberNodeClick={handleCreateNumberNode}
          onOperatorNodeClick={handleCreateOperatorNode}
        />
      )}
    </main>
  );
}
