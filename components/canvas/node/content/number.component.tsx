import { CanvasActionType, useCanvasDispatch } from "../../../../hooks";
import styles from "./number.module.css";

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
            type: CanvasActionType.CHANGE_VALUE_SLIDER,
            payload: { ...event },
          });
        }}
      />
    </>
  );
}
