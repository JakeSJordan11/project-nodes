import {
  useNodes,
  useNodesDispatch,
  usePorts,
  usePortsDispatch,
  useStreams,
  useStreamsDispatch,
} from "../../context";
import { Node } from "../node";
import { Stream } from "../stream";
import styles from "./canvas.module.css";

export function Canvas() {
  const nodes = useNodes();
  const nodesDispatch = useNodesDispatch();
  const ports = usePorts();
  const portsDispatch = usePortsDispatch();
  const streams = useStreams();
  const streamsDispatch = useStreamsDispatch();
  return (
    <main
      className={styles.main}
      onPointerUp={() => {
        portsDispatch({
          type: "CANVAS_POINTER_UP",
          payload: {
            streams: streams,
          },
        });
        streamsDispatch({
          type: "CANVAS_POINTER_UP",
          payload: { ports: ports },
        });
      }}
      onPointerMove={(event) => {
        nodesDispatch({
          type: "CANVAS_POINTER_MOVE",
          payload: {
            clientX: event.clientX,
            clientY: event.clientY,
          },
        });
        streamsDispatch({
          type: "CANVAS_POINTER_MOVE",
          payload: {
            clientX: event.clientX,
            clientY: event.clientY,
          },
        });
      }}
    >
      {nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      <svg
        className={styles.streams}
        height={"100%"}
        width={"100%"}
        preserveAspectRatio="xMinYMin meet"
      >
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </main>
  );
}
