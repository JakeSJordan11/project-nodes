import { CanvasActionType, useCanvasDispatch } from "../../../../hooks";
import styles from "./port.module.css";
import { PortProps } from "./port.types";

export function Port({ id }: PortProps) {
  const dispatch = useCanvasDispatch();
  return (
    <button
      id={id}
      className={styles.port}
      onPointerDown={(event) => {
        event.stopPropagation();
        dispatch({
          type: CanvasActionType.CREATE_STREAM,
          payload: { ...event },
        });
      }}
      onPointerUp={(event) =>
        dispatch({ type: CanvasActionType.LINK_STREAM, payload: { ...event } })
      }
    />
  );
}
