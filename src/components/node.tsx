import { Port } from "@/components/port";
import styles from "@/styles/node.module.css";
import { NodeKind, NodeProps, NodeVariant } from "@/types/node";
import { PortKind } from "@/types/port";
import { useGraph } from "src/hooks/graphs.context";

export function Node({
  id,
  value,
  title,
  position,
  kind,
  variant,
  ports,
}: NodeProps) {
  const { dispatch } = useGraph();
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
      onPointerDown={(event) =>
        dispatch({
          type: "node_pointer_down",
          payload: { event: event, id: id },
        })
      }
    >
      {ports.filter((port) => port.kind === PortKind.Input).length <
      1 ? null : (
        <div className={styles.inputs}>
          {ports.map((port) =>
            port.kind !== PortKind.Input ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </div>
      )}
      <h1 className={styles.title}>{title}</h1>
      <output className={styles.value}>{value}</output>
      {ports.filter((port) => port.kind === PortKind.Output).length <
      1 ? null : (
        <div className={styles.outputs}>
          {ports.map((port) =>
            port.kind !== PortKind.Output ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </div>
      )}
      {kind !== NodeKind.Input ? null : variant !==
        NodeVariant.Integer ? null : (
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(event) =>
            dispatch({
              type: "node_slider_change",
              payload: { event: event, id: id },
            })
          }
          onPointerDown={(event) => event.stopPropagation()}
        />
      )}
    </article>
  );
}
