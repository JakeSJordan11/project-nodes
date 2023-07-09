import styles from "./stream.module.css";
import type { StreamProps } from "./stream.types";

export function Stream({ ...stream }: StreamProps) {
  return (
    <path
      className={styles.path}
      d={stream.m && stream.l && stream.m + stream.l}
    />
  );
}
