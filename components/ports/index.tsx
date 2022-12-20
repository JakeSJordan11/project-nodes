import { forwardRef } from "react";
import styles from "./styles.module.css";
import type { PortProps } from "./types";

const Port = forwardRef<HTMLButtonElement, PortProps>(
  (
    {
      input,
      horizontal,
      output,
      onPointerDown,
      onPointerOver,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      amount,
    }: PortProps,
    ref
  ) => {
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
            ref={ref}
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
);

Port.displayName = "Port";
export default Port;
