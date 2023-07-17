import styles from "@/styles/stream.module.css";
import type { StreamProps } from "@/types/stream";

export function Stream({ ...stream }: StreamProps) {
  return <path d={stream.from + stream.to} className={styles.path} />;
}
