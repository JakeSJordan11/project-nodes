import type { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./node.module.css";
import type { NodeData } from "./node.types";

export function Node({
  id,
  title,
  position,
  children,
  onPointerDown,
}: NodeData & PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <article
      style={{
        transform: `translate(${position?.x}px, ${position?.y}px)`,
      }}
      id={id}
      title={title}
      className={styles.node}
      onPointerDown={onPointerDown}
    >
      {children}
    </article>
  );
}
