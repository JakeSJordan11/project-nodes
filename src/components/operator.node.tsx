import { Port } from "@/components/port";
import { CanvasActionTypes } from "@/constants/canvas.reducer";
import { portTypes } from "@/constants/port";
import { useCanvasDispatch } from "@/hooks/canvas.context";
import styles from "@/styles/operator.node.module.css";
import type { NodeProps } from "@/types/node";
import { PointerEvent } from "react";

export function OperatorNode({ ...node }: NodeProps) {
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
  return (
    <article
      className={styles.node}
      style={{ top: node.position?.y, left: node.position?.x }}
      onPointerUp={handleNodePointerUp}
      onPointerDown={handleNodePointerDown}
    >
      <div className={styles.inputContainer}>
        {node.ports.map(
          (port) =>
            port.type === portTypes.input && (
              <Port key={port.id} {...port} nodeId={node.id} />
            )
        )}
      </div>
      <div className={styles.contentContainer}>{node.value}</div>
      <div className={styles.selector}>Addition</div>
      <div className={styles.outputContainer}>
        {node.ports.map(
          (port) =>
            port.type === portTypes.output && (
              <Port key={port.id} {...port} nodeId={node.id} />
            )
        )}
      </div>
    </article>
  );
}
