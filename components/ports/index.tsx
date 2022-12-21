import styles from "./styles.module.css";
import type { PortProps } from "./types";

export default function Port({
  input,
  horizontal,
  output,
  onPointerDown,
  onPointerUp,
  amount,
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
    <div className={styles.container} style={dynamicStyles}>
      {Array.from(Array(amount).keys()).map((id) => (
        <button
          key={id}
          id={id.toString()}
          className={styles.port}
          onPointerUp={onPointerUp}
          onPointerDown={onPointerDown}
        />
      ))}
    </div>
  );
}
