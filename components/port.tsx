import { useCanvasDispatch } from "@/hooks/canvas.context";
import styles from "@/styles/port.module.css";
import { CanvasActionType } from "@/types/canvas.reducer.types";
import type { PortProps } from "@/types/port.types";

export function Port({ ...port }: PortProps) {
  const dispatch = useCanvasDispatch();
  return (
    <button
      id={port.id}
      value={port.portValue || 0}
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
      onPointerEnter={(event) =>
        dispatch({
          type: CanvasActionType.ENTER_PORT,
          payload: { ...event },
        })
      }
      onPointerLeave={(event) =>
        dispatch({
          type: CanvasActionType.LEAVE_PORT,
          payload: { ...event },
        })
      }
      onDoubleClick={(event) => {
        dispatch({
          type: CanvasActionType.UNLINK_STREAM,
          payload: { ...event },
        });
      }}
    />
  );
}
