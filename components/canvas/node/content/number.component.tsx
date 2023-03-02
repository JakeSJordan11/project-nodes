import { CanvasActionType, useCanvasDispatch } from "../../../../hooks";
import type { NodeProps } from "../node.types";
import styles from "./number.module.css";

export function Number({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: CanvasActionType.CHANGE_VALUE_SLIDER,
      payload: { ...event },
    });
  }
  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.value}>{node.value || 0}</div>
      </div>
      <input
        className={styles.slider}
        type="range"
        min="0"
        max="10"
        value={node.value || 0}
        onPointerDown={(event) => event.stopPropagation()}
        onChange={handleChange}
      />
    </>
  );
}
