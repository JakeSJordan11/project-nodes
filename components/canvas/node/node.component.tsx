import { CanvasActionType, useCanvasDispatch } from "../../../hooks";
import { Content } from "./content/content.component";
import styles from "./node.module.css";
import type { NodeProps } from "./node.types";
import { Port } from "./port";

export function Node({
  inputs,
  outputs,
  position,
  value,
  type,
  id,
}: NodeProps) {
  const dispatch = useCanvasDispatch();
  return (
    <article
      className={styles.node}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      id={id}
      onPointerDown={(event) =>
        dispatch({ type: CanvasActionType.SELECT_NODE, payload: { ...event } })
      }
      onPointerUp={() => dispatch({ type: CanvasActionType.DROP_SELECTION })}
    >
      <div className={styles.inputContainer}>
        {inputs.map((input) => (
          <Port key={input.id} {...input} />
        ))}
      </div>
      <Content value={value} type={type} />
      <div className={styles.outputContainer}>
        {outputs.map((output) => (
          <Port key={output.id} {...output} />
        ))}
      </div>
    </article>
  );
}
