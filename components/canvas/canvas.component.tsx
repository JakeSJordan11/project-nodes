import { PointerEvent } from "react";
import { useCanvas, useCanvasDispatch } from "../../hooks";
import { Node } from "../node";
import { Stream } from "../stream";
import styles from "./canvas.module.css";

export function Canvas() {
  const { nodes, streams } = useCanvas();
  const dispatch = useCanvasDispatch();

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({ type: "CANVAS_POINTER_MOVE", payload: { ...event } });
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    dispatch({ type: "CANVAS_POINTER_UP", payload: { ...event } });
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
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
