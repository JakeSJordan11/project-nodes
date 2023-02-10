import {
  NodesActionType,
  StreamsActionType,
  useNodesDispatch,
  usePorts,
  useStreamsDispatch,
} from "../../context";
import { Port } from "../port";
import styles from "./node.module.css";
import type { NodeData } from "./node.types";

export function Node({ id, title, position }: NodeData) {
  const nodesDispatch = useNodesDispatch();
  const streamsDispatch = useStreamsDispatch();
  const ports = usePorts();
  return (
    <article
      style={{ transform: `translate(${position?.x}px, ${position?.y}px)` }}
      id={id}
      title={title}
      className={styles.node}
      onPointerDown={(event) => {
        nodesDispatch({
          type: NodesActionType.NodePointerDown,
          payload: {
            clientX: event.clientX,
            clientY: event.clientY,
            id: event.currentTarget.id,
            boundsX: event.currentTarget.getBoundingClientRect().x,
            boundsY: event.currentTarget.getBoundingClientRect().y,
          },
        });
      }}
      onPointerMove={(event) => {
        nodesDispatch({
          type: NodesActionType.NodePointerMove,
          payload: {
            clientX: event.clientX,
            clientY: event.clientY,
          },
        });
        streamsDispatch({
          type: StreamsActionType.NodePointerMove,
          payload: {
            clientX: event.clientX,
            clientY: event.clientY,
          },
        });
      }}
      onPointerUp={() => {
        nodesDispatch({ type: NodesActionType.NodePointerUp });
      }}
    >
      <div className={styles.portContainer} style={{ top: 0 }}>
        {ports.map((port) => {
          if (port.type === "input" && port.parentId === id) {
            return <Port key={port.id} {...port} />;
          }
        })}
      </div>
      <p className={styles.nodeTitle}>{title}</p>
      <div className={styles.portContainer} style={{ bottom: 0 }}>
        {ports.map((port) => {
          if (port.type === "output" && port.parentId === id) {
            return <Port key={port.id} {...port} />;
          }
        })}
      </div>
    </article>
  );
}
