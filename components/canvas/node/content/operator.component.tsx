import type { NodeProps } from "../node.types";
import styles from "./operator.module.css";

export function Operator({ ...node }: NodeProps) {
  return (
    <>
      <div className={styles.contentContainer}>
        {node.inputs[0].portValue + node.inputs[1].portValue || 0}
      </div>
      <div className={styles.selector}>Addition</div>
    </>
  );
}
