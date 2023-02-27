import { ActionType, useCanvas, useCanvasDispatch } from "../../../../hooks";
import styles from "./content.module.css";

export function Content({ type, value }: { type: string; value: number }) {
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
      <div className={styles.contentContainer}>
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
