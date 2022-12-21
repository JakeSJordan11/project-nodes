import styles from "./styles.module.css";
import { PortProps } from "./types";

export default function Port({
  onPointerDown,
  onPointerOver,
  onPointerLeave,
}: PortProps) {
  return (
    <button
      aria-label="port"
      type="button"
      className={styles.port}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerLeave={onPointerLeave}
    />
  );
}
