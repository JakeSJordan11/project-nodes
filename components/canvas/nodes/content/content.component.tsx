import { ActionType, useCanvas, useCanvasDispatch } from "../../../../hooks";
import type { Node } from "../node.types";
import styles from "./content.module.css";

export function Content({ type, value }: Node) {
  switch (type) {
    case "number":
      return <Number value={value} />;
    case "operator":
      return <Operator />;
    default:
      return <div className={styles.container}>default</div>;
  }
}

export function Number({ value }: { value: number }) {
  const dispatch = useCanvasDispatch();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.value}>{value}</div>
      </div>
      <input
        className={styles.slider}
        type="range"
        min="0"
        max="10"
        value={value}
        onPointerDown={(event) => event.stopPropagation()}
        onChange={(event) => {
          dispatch({
            type: ActionType.CHANGE_NUMBER_VALUE,
            payload: { ...event },
          });
        }}
      />
    </>
  );
}

export function Operator() {
  const { nodes } = useCanvas();
  return (
    <>
      <select
        className={styles.selector}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <option>add</option>
        <option>subtract</option>
        <option>multiply</option>
        <option>divide</option>
      </select>
      <div className={styles.container}>
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
