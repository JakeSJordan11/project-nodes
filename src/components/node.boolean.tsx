import { Port } from '@/components/port'
import { useGraph } from '@/hooks/graphs.context'
import styles from '@/styles/node.module.css'
import { NodeProps } from '@/types/node'
import { PortKind } from '@/types/port'
import { ChangeEvent, PointerEvent, useEffect } from 'react'

export function BooleanNode({
  id,
  value,
  position,
  variant,
  ports,
}: NodeProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    dispatch({
      type: 'node_value_change',
      payload: { value: value, id: id },
    })
  }, [value])

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: 'node_pointer_down',
      payload: { event: event, id: id },
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: 'node_slider_change',
      payload: { event: event, id: id },
    })
  }

  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
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
      <h1 className={styles.title}>{variant}</h1>
      <output className={styles.value}>{String(value)}</output>
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
      <input
        type='checkbox'
        value={String(value)}
        checked={Boolean(value)}
        onChange={handleChange}
        onPointerDown={(event) => event.stopPropagation()}
      />
    </article>
  )
}
