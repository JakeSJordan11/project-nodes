import { useState } from "react";
import { NodeMenu, Port } from "../components";
import { useCanvasDispatch } from "../hooks";
import styles from "../styles/node.operator.module.css";
import { CanvasActionType, type NodeProps } from "../types";

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
      {node.inputs && (
        <div className={styles.inputContainer}>
          {node.inputs &&
            node.inputs.map((input) => (
              <Port key={input.id} {...input} id={input.id} nodeId={node.id} />
            ))}
        </div>
      )}
      <div className={styles.contentContainer}>
        {node.inputs[0].portValue + node.inputs[1].portValue || 0}
      </div>
      <div className={styles.selector}>Addition</div>
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
