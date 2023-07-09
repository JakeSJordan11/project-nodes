import { CanvasActionType, useCanvasDispatch } from "../../../hooks";
import { Content } from "./content/content.component";
import styles from "./node.module.css";
import type { NodeProps } from "./node.types";
import { Inputs, Outputs } from "./port";

export function Node({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch();
  return (
    <article
      id={node.id}
      className={styles.node}
      style={{ top: node.position.y, left: node.position.x }}
      onPointerUp={() => dispatch({ type: CanvasActionType.DROP_SELECTION })}
      onPointerDown={(event) =>
        dispatch({ type: CanvasActionType.SELECT_NODE, payload: { ...event } })
      }
    >
      <Inputs {...node} />
      <Content {...node} />
      <Outputs {...node} />
    </article>
  );
}
