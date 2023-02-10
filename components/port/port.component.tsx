import {
  PortsActionType,
  StreamsActionType,
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
      className={styles.port}
      onPointerDown={(event) => {
        event.stopPropagation();
        streamsDispatch({
          type: StreamsActionType.PortPointerDown,
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
          type: StreamsActionType.PortPointerEnter,
          payload: {
            currentTarget: event.currentTarget as HTMLButtonElement,
            id: event.currentTarget.id,
            ports: ports,
          },
        })
      }
      onPointerLeave={() =>
        streamsDispatch({ type: StreamsActionType.PortPointerLeave })
      }
      onDoubleClick={(event) => {
        streamsDispatch({
          type: StreamsActionType.PortDoubleClick,
          payload: {
            id: event.currentTarget.id,
          },
        });

        portsDispatch({
          type: PortsActionType.PortDoubleClick,
          payload: {
            id: event.currentTarget.id,
            streams: streams,
          },
        });
      }}
    />
  );
}
