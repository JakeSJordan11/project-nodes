import { Stream } from "@/components/stream";
import { useCanvas } from "@/hooks/canvas.context";
import styles from "@/styles/stream.module.css";
import type { StreamProps } from "@/types/stream.types";

export function Streams() {
  const { streams } = useCanvas();
  return (
    <svg className={styles.svg} preserveAspectRatio="xMinYMin meet">
      {streams.map((stream: StreamProps) => (
        <Stream key={stream.id} {...stream} />
      ))}
    </svg>
  );
}
