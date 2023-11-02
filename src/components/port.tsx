import styles from "@/styles/port.module.css";
import { PortProps } from "@/types/port";
import { useRef } from "react";
import { useGraph } from "src/hooks/graphs.context";

export function Port({ id, value }: PortProps) {
  const { dispatch } = useGraph();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      className={styles.port}
      onPointerDown={(event) => {
        event.stopPropagation();
        dispatch({
          type: "port_pointer_down",
          payload: { event: event, id: id, value: value, ref: ref },
        });
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        dispatch({
          type: "port_pointer_up",
          payload: { event: event, id: id, value: value, ref: ref },
        });
      }}
    />
  );
}
