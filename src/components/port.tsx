import { CanvasActionTypes } from "@/constants/canvas.reducer";
import { portTypes } from "@/constants/port";
import { useCanvasDispatch } from "@/hooks/canvas.context";
import styles from "@/styles/port.module.css";
import type { PortProps } from "@/types/port";
import { PointerEvent, useEffect, useRef } from "react";

export function Port({ ...port }: PortProps) {
  const dispatch = useCanvasDispatch();
  const portRef = useRef<HTMLButtonElement>(null);

  function handlePortPointerDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: CanvasActionTypes.CreateStream,
      payload: {
        portRef: portRef,
        portType: port.type,
        portStatus: port.status,
        id: port.id,
        nodeId: port.nodeId,
        fromValue: port.value,
      },
    });
    event.stopPropagation();
  }

  function handlePortPointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    dispatch({
      type: CanvasActionTypes.AttemptLink,
      payload: {
        portRef: portRef,
        id: port.id,
        nodeId: port.nodeId,
        portType: port.type,
        portStatus: port.status,
      },
    });
  }

  return (
    <button
      ref={portRef}
      className={styles.port}
      onPointerDown={handlePortPointerDown}
      onPointerUp={handlePortPointerUp}
    />
  );
}
