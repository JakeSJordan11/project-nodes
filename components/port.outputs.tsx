import { Port } from "../components";
import styles from "../styles/port.module.css";
import type { NodeProps } from "../types";

export function Outputs({ ...node }: NodeProps) {
  return (
    <div className={styles.outputContainer}>
      {node.outputs &&
        node.outputs.map((output) => (
          <Port key={output.id} {...output} id={output.id} nodeId={node.id} />
        ))}
    </div>
  );
}
