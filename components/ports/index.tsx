import styles from "./styles.module.css";
import type { PortProps } from "./types";

export default function Port({
  input,
  horizontal,
  output,
  amount,
  onPointerDown,
  onPointerOver,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}: PortProps) {
  const dynamicStyles = {
    top: input ? 0 : undefined,
    bottom: output ? 0 : undefined,
    left: horizontal ? (input ? 0 : undefined) : 0,
    right: horizontal ? (output ? 0 : undefined) : 0,
    height: horizontal ? "100%" : 0,
    width: horizontal ? 0 : "100%",
    flexDirection: horizontal ? "column" : undefined,
  } as const;

  return (
    /* INFO: this div allows the ports to be positioned evenly along the edges of the node using css */
    <div className={styles.container} style={dynamicStyles}>
      {Array.from(Array(amount).keys()).map((id) => (
        <button
          key={id}
          id={id.toString()}
          className={styles.port}
          onPointerDown={onPointerDown}
          onPointerOver={onPointerOver}
          onPointerUp={onPointerUp}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
      ))}
    </div>
  );
}
