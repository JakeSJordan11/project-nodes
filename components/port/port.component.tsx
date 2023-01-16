import styles from "./port.module.css";
import type { PortProps } from "./port.types";

export function Port({
  id,
  title,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: PortProps) {
  return (
    <button
      id={id}
      title={title}
      className={styles.port}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
}
