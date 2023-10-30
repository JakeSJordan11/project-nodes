import styles from "@/styles/port.module.css";
import { PortProps } from "@/types/port";

export function Port({ id, value, onPointerUp, onPointerDown }: PortProps) {
  return (
    <button
      className={styles.port}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown(event, id, value);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onPointerUp(event, id, value);
      }}
    />
  );
}
