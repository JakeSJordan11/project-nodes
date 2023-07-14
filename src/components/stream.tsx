import type { StreamProps } from "@/types/stream.types";
import styles from "@/styles/stream.module.css";

export function Stream({ ...stream }: StreamProps) {
  return (
    <path
      className={styles.path}
      d={stream.m && stream.l && stream.m + stream.l}
    />
  );
}
