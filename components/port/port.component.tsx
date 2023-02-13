import { useCanvasDispatch } from "../../hooks";
import type { PortData } from "../../types";
import styles from "./port.module.css";

export function Port({ id, title }: PortData) {
  const dipatch = useCanvasDispatch();
  return (
    <button
      id={id}
      title={title}
      type="button"
      className={styles.port}
      onPointerDown={(event) => {
        event.stopPropagation();
        dipatch({ type: "PORT_POINTER_DOWN", payload: event });
      }}
      onPointerEnter={(event) => {
        dipatch({ type: "PORT_POINTER_ENTER", payload: event });
      }}
      onPointerLeave={() => {
        dipatch({ type: "PORT_POINTER_LEAVE" });
      }}
      onDoubleClick={(event) => {
        dipatch({ type: "PORT_DOUBLE_CLICK", payload: event });
      }}
    />
  );
}
