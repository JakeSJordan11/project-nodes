import { Port } from "@/components/port";
import { CanvasActionTypes } from "@/constants/canvas.reducer";
import { portTypes } from "@/constants/port";
import { useCanvasDispatch } from "@/hooks/canvas.context";
import styles from "@/styles/number.node.module.css";
import type { NodeProps } from "@/types/node";
import type { PointerEvent } from "react";

export function NumberNode({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch();

  function handleNodePointerUp(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionTypes.DropSelection,
      payload: {
        id: node.id,
        x: event.clientX,
        y: event.clientY,
      },
    });
  }

  function handleNodePointerDown(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: CanvasActionTypes.SelectNode,
      payload: { id: node.id, x: event.clientX, y: event.clientY },
    });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: CanvasActionTypes.UpdateNode,
      payload: { id: node.id, value: parseInt(event.target.value) },
    });
  }

  return (
    <article
      className={styles.node}
      style={{ top: node.position?.y, left: node.position?.x }}
      onPointerUp={handleNodePointerUp}
      onPointerDown={handleNodePointerDown}
    >
      <div className={styles.contentContainer}>
        <div className={styles.value}>{node.value}</div>
      </div>
      <input
        className={styles.slider}
        type="range"
        min="0"
        max="10"
        value={node.value}
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        onChange={handleInputChange}
      />
      <div className={styles.outputContainer}>
        {node.ports.map(
          (port) =>
            port.type === portTypes.output && (
              <Port
                key={port.id}
                {...port}
                nodeId={node.id}
                value={node.value}
              />
            )
        )}
      </div>
    </article>
  );
}
