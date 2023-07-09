import type { NodeProps } from "../node.types";
import { Port } from "./port.component";
import styles from "./port.module.css";

export function Outputs({ ...node }: NodeProps) {
  return (
    <div className={styles.outputContainer}>
      {node.outputs &&
        node.outputs.map((output) => (
          <Port
            key={output.id}
            {...output}
            portValue={
              node.type === "operator"
                ? node.inputs[0].portValue + node.inputs[1].portValue
                : output.portValue
            }
          />
        ))}
    </div>
  );
}
