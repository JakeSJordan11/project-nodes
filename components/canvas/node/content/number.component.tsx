import { CanvasActionType, useCanvasDispatch } from "../../../../hooks";
import type { NodeProps } from "../node.types";
import styles from "./number.module.css";

export function Number({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch();
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
        onChange={(event) =>
          dispatch({
            type: CanvasActionType.CHANGE_VALUE_SLIDER,
            payload: { ...event },
          })
        }
      />
    </>
  );
}
