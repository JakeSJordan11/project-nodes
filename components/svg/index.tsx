import type { SvgProps } from "./types";
import styles from "./styles.module.css";

export default function Svg({ children }: SvgProps) {
  return (
    <svg
      className={styles.connectors}
      preserveAspectRatio="xMinYMin meet"
      height={"100%"}
      width={"100%"}
    >
      {children}
    </svg>
  );
}
