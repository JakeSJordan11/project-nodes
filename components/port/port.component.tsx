import type { PortProps, PortData } from "./port.types";
import styles from "./port.module.css";

export function Port({
  onPointerDown,
  onPointerOver,
  onPointerOut,
  portId,
}: PortProps & PortData) {
  return (
    <button
      type="button"
      aria-label="port"
      id={portId.toString()}
      className={styles.port}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
}
