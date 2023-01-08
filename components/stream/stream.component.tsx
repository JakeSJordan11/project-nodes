import type { StreamData, StreamProps } from "./stream.types";
import styles from "./stream.module.css";

export function Stream({
  streamColor = "red",
  streamId,
  d,
}: StreamData & StreamProps) {
  return (
    <svg
      preserveAspectRatio="xMinYMin meet"
      height={"100%"}
      width={"100%"}
      className={styles.streams}
    >
      <path
        id={streamId?.toString()}
        fill="none"
        stroke={streamColor}
        strokeWidth="4"
        strokeLinecap="round"
        d={d}
      />
    </svg>
  );
}
