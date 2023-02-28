import { useCanvas } from "../../../../hooks";
import styles from "./operator.module.css";

export function Operator() {
  const { nodes } = useCanvas();
  return (
    <>
      <div
        className={styles.selector}
        onPointerDown={(event) => event.stopPropagation()}
      >
        add
      </div>
      <div className={styles.contentContainer}>
        {nodes.map((node) =>
          node.inputs.map((input) => (
            <div key={input.id} className={styles.input}>
              {input.value}
            </div>
          ))
        )}
      </div>
    </>
  );
}
