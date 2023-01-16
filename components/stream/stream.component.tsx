import styles from "./stream.module.css";
import type { StreamData } from "./stream.types";

export function Stream({ stroke, id, d }: StreamData) {
  return (
    <svg
      className={styles.streams}
      height={"100%"}
      width={"100%"}
      preserveAspectRatio="xMinYMin meet"
    >
      <path
        id={id}
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        d={d}
      />
    </svg>
  );
}
