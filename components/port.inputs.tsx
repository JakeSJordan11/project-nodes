import { Port } from "../components";
import styles from "../styles/port.module.css";
import type { NodeProps } from "../types";

export function Inputs({ ...node }: NodeProps) {
  return (
    <div className={styles.inputContainer}>
      {node.inputs &&
        node.inputs.map((input) => (
          <Port key={input.id} {...input} id={input.id} nodeId={node.id} />
        ))}
    </div>
  );
}
