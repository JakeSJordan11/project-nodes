import { useState } from "react";
import { NodeMenu, Port } from "../components";
import { useCanvasDispatch } from "../hooks";
import styles from "../styles/node.number.module.css";
import { CanvasActionType, type NodeProps } from "../types";

export function NumberNode({ ...node }: NodeProps) {
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
      <div className={styles.contentContainer}>
        <div className={styles.value}>{node.value || 0}</div>
      </div>
      <input
        className={styles.slider}
        type="range"
        min="0"
        max="10"
        value={node.value || 0}
        onPointerDown={(event) => event.stopPropagation()}
        onChange={(event) =>
          dispatch({
            type: CanvasActionType.CHANGE_VALUE_SLIDER,
            payload: { ...event },
          })
        }
      />
      {node.outputs && (
        <div className={styles.outputContainer}>
          {node.outputs &&
            node.outputs.map((output) => (
              <Port
                key={output.id}
                {...output}
                id={output.id}
                nodeId={node.id}
              />
            ))}
        </div>
      )}
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
