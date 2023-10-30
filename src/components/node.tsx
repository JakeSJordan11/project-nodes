import { Port } from "@/components/port";
import styles from "@/styles/node.module.css";
import { NodeKind, NodeProps, NodeVariant } from "@/types/node";
import { PortKind } from "@/types/port";

export function Node({
  id,
  value,
  title,
  position,
  kind,
  variant,
  ports,
  onNodePointerDown,
  onPortPointerDown,
  onPortPointerUp,
  onValueChange,
}: NodeProps) {
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
      onPointerDown={(event) => onNodePointerDown(event, id)}
    >
      {ports.filter((port) => port.kind === PortKind.Input).length > 0 ? (
        <div className={styles.inputs}>
          {ports.map((port) =>
            port.kind === PortKind.Input ? (
              <Port
                {...port}
                key={port.id}
                onPointerDown={(event, portId, portValue) =>
                  onPortPointerDown(event, portId, portValue, id, value)
                }
                onPointerUp={(event, portId, portValue) =>
                  onPortPointerUp(event, portId, portValue, id, value)
                }
                value={port.value}
              />
            ) : null
          )}
        </div>
      ) : null}
      <h1 className={styles.title}>{title}</h1>
      <output className={styles.value}>{value}</output>
      {ports.filter((port) => port.kind === PortKind.Output).length > 0 ? (
        <div className={styles.outputs}>
          {ports.map((port) =>
            port.kind === PortKind.Output ? (
              <Port
                {...port}
                key={port.id}
                onPointerDown={(event, portId, portValue) =>
                  onPortPointerDown(event, portId, portValue, id, value)
                }
                onPointerUp={(event, portId, portValue) =>
                  onPortPointerUp(event, portId, portValue, id, value)
                }
                value={port.value}
              />
            ) : null
          )}
        </div>
      ) : null}
      {kind === NodeKind.Input ? (
        variant === NodeVariant.Integer ? (
          <input
            type="range"
            min="0"
            max="10"
            value={value}
            onPointerDown={(event) => event.stopPropagation()}
            onChange={(event) => onValueChange(event, id)}
          />
        ) : null
      ) : null}
    </article>
  );
}
