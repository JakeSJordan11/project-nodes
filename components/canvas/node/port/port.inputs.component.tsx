import type { NodeProps } from "../node.types";
import { Port } from "./port.component";
import styles from "./port.module.css";

export function Inputs({ ...node }: NodeProps) {
  return (
    <div className={styles.inputContainer}>
      {node.inputs &&
        node.inputs.map((input) => (
          <Port
            key={input.id}
            {...input}
            portValue={
              node.type === "operator"
                ? node.inputs[0].portValue + node.inputs[1].portValue
                : input.portValue
            }
          />
        ))}
    </div>
  );
}
