import type { NodeProps } from "../node.types";
import styles from "./operator.module.css";

export function Operator({ ...node }: NodeProps) {
  return (
    <>
      <div className={styles.contentContainer}>{node.value}</div>
      <div className={styles.selector}>Addition</div>
    </>
  );
}
