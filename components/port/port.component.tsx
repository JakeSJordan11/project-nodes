import type { MouseEvent, PointerEvent } from "react";
import { ActionType, useCanvasDispatch } from "../../hooks";
import type { PortData } from "../../types";
import styles from "./port.module.css";

export function Port({ id, title }: PortData) {
  const dipatch = useCanvasDispatch();

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    event.stopPropagation();
    dipatch({ type: ActionType.PORT_POINTER_DOWN, payload: { ...event } });
  }

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    dipatch({ type: ActionType.PORT_POINTER_ENTER, payload: { ...event } });
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    dipatch({ type: ActionType.PORT_POINTER_LEAVE, payload: { ...event } });
  }

  function handleDoubleClick(event: MouseEvent<HTMLElement>) {
    dipatch({ type: ActionType.PORT_DOUBLE_CLICK, payload: { ...event } });
  }

  return (
    <button
      id={id}
      title={title}
      type="button"
      className={styles.port}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onDoubleClick={handleDoubleClick}
    />
  );
}
