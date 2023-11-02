import styles from "@/styles/port.module.css";
import { PortProps } from "@/types/port";
import { useGraph } from "src/hooks/graphs.context";

export function Port({ id, value }: PortProps) {
  const { dispatch } = useGraph();

  return (
    <button
      className={styles.port}
      onPointerDown={(event) => {
        event.stopPropagation();
        dispatch({
          type: "port_pointer_down",
          payload: { event: event, id: id, value: value },
        });
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        dispatch({
          type: "port_pointer_up",
          payload: { event: event, id: id, value: value },
        });
      }}
    />
  );
}
