import styles from "./node.module.css";
import type { NodeData, NodeProps } from "./node.types";

export function Node({
  nodeId,
  nodeTitle,
  nodePosition,
  children,
  onPointerDown,
}: NodeProps & NodeData) {
  return (
    <article
      className={styles.node}
      title={nodeTitle}
      id={nodeId?.toString()}
      style={{
        transform: `translate(${nodePosition?.x}px, ${nodePosition?.y}px)`,
      }}
      onPointerDown={onPointerDown}
    >
      {children}
    </article>
  );
}
