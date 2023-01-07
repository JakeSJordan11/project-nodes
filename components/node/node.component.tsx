import { Port } from "../port";
import styles from "./node.module.css";
import type { NodeData, NodeProps } from "./node.types";

export function Node({
  ports,
  nodeId,
  nodeTitle,
  nodePosition,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  portProps,
}: NodeProps & NodeData) {
  return (
    <article
      className={styles.node}
      title={nodeTitle}
      id={nodeId.toString()}
      style={{
        transform: `translate(${nodePosition.x}px, ${nodePosition.y}px)`,
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <div className={styles.portContainer} style={{ top: 0 }}>
        {ports
          ?.filter((port) => port.portType === "input")
          .map((port) => (
            <Port {...portProps} key={port.portId} />
          ))}
      </div>
      <p className={styles.title}>{nodeTitle}</p>
      <div className={styles.portContainer} style={{ bottom: 0 }}>
        {ports
          ?.filter((port) => port.portType === "output")
          .map((port) => (
            <Port {...portProps} key={port.portId} />
          ))}
      </div>
    </article>
  );
}
