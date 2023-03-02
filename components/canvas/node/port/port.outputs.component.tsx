import type { NodeProps } from "../node.types";
import { Port } from "./port.component";
import styles from "./port.module.css";

export function Outputs({ ...node }: NodeProps) {
  return (
    <div className={styles.outputContainer}>
      {node.outputs &&
        node.outputs.map((output) => <Port key={output.id} {...output} />)}
    </div>
  );
}
