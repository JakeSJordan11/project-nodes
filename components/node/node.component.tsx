import { useNodesDispatch, usePorts } from "../../context";
import { Port } from "../port";
import styles from "./node.module.css";
import type { NodeData } from "./node.types";

export function Node({ id, title, position }: NodeData) {
  const nodesDispatch = useNodesDispatch();
  const ports = usePorts();
  return (
    <article
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      id={id}
      title={title}
      className={styles.node}
      onPointerDown={(event) => {
        nodesDispatch({
          type: "NODE_POINTER_DOWN",
          payload: {
            clientX: event.clientX,
            clientY: event.clientY,
            id: event.currentTarget.id,
            boundsX: event.currentTarget.getBoundingClientRect().x,
            boundsY: event.currentTarget.getBoundingClientRect().y,
          },
        });
      }}
      onPointerUp={() => {
        nodesDispatch({ type: "NODE_POINTER_UP" });
      }}
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
