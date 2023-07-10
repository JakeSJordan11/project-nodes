import { useState } from "react";
import { useCanvasDispatch } from "../hooks";
import styles from "../styles/node.operator.module.css";
import { CanvasActionType, type NodeProps } from "../types";
import { Inputs, NodeMenu, Outputs } from "../components";

export function OperatorNode({ ...node }: NodeProps) {
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
      {node.inputs && <Inputs {...node} />}
      <div className={styles.contentContainer}>
        {node.inputs[0].portValue + node.inputs[1].portValue || 0}
      </div>
      <div className={styles.selector}>Addition</div>
      {node.outputs && <Outputs {...node} />}
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
