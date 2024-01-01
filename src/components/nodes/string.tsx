'use client'

import { Port } from '@/components/port'
import { useGraph } from '@/contexts/graph.povider'
import { PortKind } from '@/enums/port'
import styles from '@/styles/node.module.css'
import type { NodeProps } from '@/types/node'
import { useEffect, type ChangeEvent, type PointerEvent } from 'react'

export function String({ id, value, position, variant, ports }: NodeProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    dispatch({
      type: 'node_value_change',
      payload: { value: value, id: id },
    })
  }, [value, id, dispatch])

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
      <output className={styles.value}>
        <input
          className={styles.stringValue}
          type='text'
          placeholder='Enter a string'
          value={value?.toString()}
          onChange={handleChange}
          onPointerDown={(event) => event.stopPropagation()}
        />
      </output>
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
    </article>
  )
}
