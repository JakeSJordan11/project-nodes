import type { PortData } from "./port.types";
import type { ButtonHTMLAttributes } from "react";
import styles from "./port.module.css";

export function Port({
  id,
  title,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}: PortData & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      id={id}
      type="button"
      title={title}
      className={styles.port}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
}
