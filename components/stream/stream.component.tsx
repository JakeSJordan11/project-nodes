import styles from "./stream.module.css";
import type { StreamData } from "./stream.types";

export function Stream({ color, id, d }: StreamData & { d: string }) {
  return (
    <svg
      preserveAspectRatio="xMinYMin meet"
      height={"100%"}
      width={"100%"}
      className={styles.streams}
    >
      <path
        id={id}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        d={d}
      />
    </svg>
  );
}
