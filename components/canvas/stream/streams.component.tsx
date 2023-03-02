import { useCanvas } from "../../../hooks";
import { Stream } from "./stream.component";
import styles from "./stream.module.css";

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
