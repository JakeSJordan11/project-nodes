import styles from "./node.module.css";
import { NodeProps } from "./node.types";

export function Node({
  id,
  title,
  position,
  children,
  onPointerDown,
}: NodeProps) {
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
