import {
  usePorts,
  usePortsDispatch,
  useStreams,
  useStreamsDispatch,
} from "../../context";
import styles from "./port.module.css";
import { PortData } from "./port.types";

export function Port({ id, title }: PortData) {
  const streams = useStreams();
  const streamsDispatch = useStreamsDispatch();
  const ports = usePorts();
  const portsDispatch = usePortsDispatch();
  return (
    <button
      id={id}
      title={title}
      type="button"
      className={styles.port}
      onPointerDown={(event) => {
        event.stopPropagation();
        streamsDispatch({
          type: "PORT_POINTER_DOWN",
          payload: {
            boundsX: event.currentTarget.getBoundingClientRect().x,
            boundsY: event.currentTarget.getBoundingClientRect().y,
            id: event.currentTarget.id,
            currentTarget: event.currentTarget,
            ports: ports,
          },
        });
      }}
      onPointerEnter={(event) =>
        streamsDispatch({
          type: "PORT_POINTER_ENTER",
          payload: {
            currentTarget: event.currentTarget as HTMLButtonElement,
            id: event.currentTarget.id,
            ports: ports,
          },
        })
      }
      onPointerLeave={() => streamsDispatch({ type: "PORT_POINTER_LEAVE" })}
      onDoubleClick={(event) => {
        portsDispatch({
          type: "PORT_DOUBLE_CLICK",
          payload: {
            id: event.currentTarget.id,
            streams: streams,
          },
        });
        streamsDispatch({
          type: "PORT_DOUBLE_CLICK",
          payload: {
            id: event.currentTarget.id,
          },
        });
      }}
    />
  );
}
