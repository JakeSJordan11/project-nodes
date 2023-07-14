import { NodeContextMenu } from "@/components/node.contextmenu";
import { Port } from "@/components/port";
import { useCanvasDispatch } from "@/hooks/canvas.context";
import styles from "@/styles/node.operator.module.css";
import { CanvasActionType } from "@/types/canvas.reducer.types";
import type { NodeProps } from "@/types/node.types";
import { useMemo, useState } from "react";

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
      <div className={styles.inputContainer}>
        {node.inputs.map((input) => (
          <Port key={input.id} {...input} />
        ))}
      </div>
      <div className={styles.contentContainer}>
        {node.inputs.reduce((acc, input) => acc + input.portValue, 0)}
      </div>
      <div className={styles.selector}>Addition</div>
      {node.outputs && (
        <div className={styles.outputContainer}>
          {node.outputs.map((output) => (
            <Port
              key={output.id}
              {...output}
              portValue={node.inputs.reduce(
                (acc, input) => acc + input.portValue,
                0
              )}
            />
          ))}
        </div>
      )}
      {nodeContextMenuOpen && (
        <NodeContextMenu
          nodeContextMenuPosition={nodeContextMenuPosition}
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
