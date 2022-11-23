import styles from "./styles.module.css";
import type { ConnectorProps } from "./types";

export default function Connector({ currentPath }: ConnectorProps) {
  return (
    <svg className={styles.connectors} preserveAspectRatio="xMinYMin meet">
      <linearGradient x1="50%" y1="92.034%" x2="50%" y2="7.2%" id="a">
        <stop offset="0%" stopColor="var(--color-background-mathNode)" />
        <stop offset="100%" stopColor="var(--color-background-numberNode)" />
      </linearGradient>
      <g
        fill="none"
        stroke="url(#a)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d={`M ${currentPath.x1} ${currentPath.y1} L ${currentPath.x2} ${currentPath.y2}`}
        />
      </g>
    </svg>
  );
}
