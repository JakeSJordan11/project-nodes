import { Port } from '@/components/port'
import styles from '@/styles/node.module.css'
import { NodeKind, NodeProps, NodeVariant } from '@/types/node'
import { PortKind } from '@/types/port'

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
  const inputPorts = ports.filter((port) => port.kind === PortKind.Input)
  const outputPorts = ports.filter((port) => port.kind === PortKind.Output)
  return (
    <article
      id={id}
      className={styles.node}
      style={{ left: position.x, top: position.y }}
      onPointerDown={onNodePointerDown}
      tabIndex={0}
    >
      {inputPorts.length > 0 ? (
        <div className={styles.inputs}>
          {ports.map((port) =>
            port.kind === PortKind.Input ? (
              <Port
                {...port}
                key={port.id}
                onPointerUp={onPortPointerUp}
                onPointerDown={(event) => event.stopPropagation()}
                value={port.value}
              />
            ) : null
          )}
        </div>
      ) : null}
      <h1 className={styles.title}>{title}</h1>
      <output className={styles.value} tabIndex={0}>
        {variant === NodeVariant.Addition
          ? Number(ports[0].value) + Number(ports[1].value) ||
            Number(ports[0].value) ||
            Number(ports[1].value) ||
            null
          : variant === NodeVariant.Integer
          ? Number(value)
          : null}
      </output>
      {outputPorts.length > 0 ? (
        <div className={styles.outputs}>
          {ports.map((port) =>
            port.kind === PortKind.Output ? (
              <Port
                {...port}
                key={port.id}
                onPointerDown={onPortPointerDown}
                value={value}
              />
            ) : null
          )}
        </div>
      ) : null}
      {kind === NodeKind.Input ? (
        variant === NodeVariant.Integer ? (
          <input
            type='range'
            min='0'
            max='10'
            value={Number(value)}
            onPointerDown={(event) => event.stopPropagation()}
            onChange={onValueChange}
          />
        ) : null
      ) : null}
    </article>
  )
}
