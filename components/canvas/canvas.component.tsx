import { useNodes, useStreams } from "../../context";
import { Node } from "../node";
import { Stream } from "../stream";
import styles from "./canvas.module.css";

export function Canvas() {
  const nodes = useNodes();
  const streams = useStreams();
  return (
    <>
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
    </>
  );
}
