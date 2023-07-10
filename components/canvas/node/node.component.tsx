import { useState } from "react";
import { CanvasActionType, useCanvasDispatch } from "../../../hooks";
import { Content } from "./content/content.component";
import { NodeMenu } from "./menu";
import styles from "./node.module.css";
import type { NodeProps } from "./node.types";
import { Inputs, Outputs } from "./port";

export function Node({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch();
  const [nodeContextMenuOpen, setNodeContextMenuOpen] = useState(false);
  const [nodeContextMenuPosition, setNodeContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  return (
    <article
      id={node.id}
      className={styles.node}
      style={{ top: node.position.y, left: node.position.x }}
      onContextMenu={(event) => {
        event.preventDefault();
        setNodeContextMenuOpen(true);
        setNodeContextMenuPosition({
          x: event.clientX - node.position.x,
          y: event.clientY - node.position.y,
        });
      }}
      onClick={() => setNodeContextMenuOpen(false)}
      onPointerUp={() => dispatch({ type: CanvasActionType.DROP_SELECTION })}
      onPointerDown={(event) =>
        dispatch({ type: CanvasActionType.SELECT_NODE, payload: { ...event } })
      }
    >
      <Inputs {...node} />
      <Content {...node} />
      <Outputs {...node} />
      {nodeContextMenuOpen && (
        <NodeMenu
          nodeMenuPosition={nodeContextMenuPosition}
          onRemoveNodeClick={() => {
            setNodeContextMenuOpen(false);
            dispatch({
              type: CanvasActionType.REMOVE_NODE,
              payload: { id: node.id },
            });
          }}
        />
      )}
    </article>
  );
}
