import type { PointerEvent } from "react";
import { useCanvas, useCanvasDispatch } from "../../hooks";
import type { NodeData } from "../../types";
import { Port } from "../port";
import styles from "./node.module.css";

export function Node({ id, title, position }: NodeData) {
  const { ports } = useCanvas();
  const dispatch = useCanvasDispatch();

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    dispatch({ type: "NODE_POINTER_DOWN", payload: { ...event } });
  }
  return (
    <article
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      id={id}
      title={title}
      className={styles.node}
      onPointerDown={handlePointerDown}
    >
      <div className={styles.portContainerTop}>
        {ports.map((port) => {
          if (port.type === "input" && port.parentId === id) {
            return <Port key={port.id} {...port} />;
          }
        })}
      </div>
      <p className={styles.nodeTitle}>{title}</p>
      <div className={styles.portContainerBottom}>
        {ports.map((port) => {
          if (port.type === "output" && port.parentId === id) {
            return <Port key={port.id} {...port} />;
          }
        })}
      </div>
    </article>
  );
}
