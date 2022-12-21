"use client";

import { useNodes } from "../../hooks/useNodes";
import Port from "../ports";
import styles from "./styles.module.css";
import type { NodeProps } from "./types";

export function Node({
  onPortPointerDown,
  onPortPointerOver,
  onPortPointerLeave,
  ports,
  id,
  title,
}: NodeProps) {
  const {
    nodeStyles,
    handleNodePointerUp,
    handleNodePointerDown,
    handleNodePointerMove,
  } = useNodes();

  return (
    <article
      id={id}
      className={styles.node}
      aria-label="node"
      style={nodeStyles}
      onPointerDown={handleNodePointerDown}
      onPointerUp={handleNodePointerUp}
      onPointerMove={handleNodePointerMove}
    >
      <div className={styles.portContainer} style={{ top: 0 }}>
        {ports
          ?.filter((port) => port.type === "input")
          .map((port) => (
            <Port
              key={port.id}
              id={port.id}
              type={port.type}
              onPointerDown={onPortPointerDown}
              onPointerOver={onPortPointerOver}
              onPointerLeave={onPortPointerLeave}
            />
          ))}
      </div>
      <p className={styles.title}>{title}</p>
      <div className={styles.portContainer} style={{ bottom: 0 }}>
        {ports
          ?.filter((port) => port.type === "output")
          .map((port) => (
            <Port
              key={port.id}
              id={port.id}
              type={port.type}
              onPointerDown={onPortPointerDown}
              onPointerOver={onPortPointerOver}
              onPointerLeave={onPortPointerLeave}
            />
          ))}
      </div>
    </article>
  );
}
