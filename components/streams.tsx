import { Stream } from "../components";
import { useCanvas } from "../hooks";
import styles from "../styles/stream.module.css";

export function Streams() {
  const { streams } = useCanvas();
  return (
    <svg className={styles.svg} preserveAspectRatio="xMinYMin meet">
      {streams.map((stream) => (
        <Stream key={stream.id} {...stream} />
      ))}
    </svg>
  );
}
