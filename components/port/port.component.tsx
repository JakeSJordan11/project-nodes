import type { PortProps } from "./port.types";
import styles from "./port.module.css";

export function Port({
  onPointerDown,
  onPointerOver,
  onPointerLeave,
}: PortProps) {
  return (
    <button
      type="button"
      aria-label="port"
      className={styles.port}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerLeave={onPointerLeave}
    />
  );
}
