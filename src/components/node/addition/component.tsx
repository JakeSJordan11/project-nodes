'use client'

import { useEffect, type PointerEvent } from 'react'
import { useGraph } from '../../graph/context/component'
import { Port } from '../../port/component'
import { PortKind } from '../../port/enums'
import styles from '../styles.module.css'
import type { NodeProps } from '../types'

export function Addition({ id, value, position, variant, ports }: NodeProps) {
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
              <Port {...port} key={port.id} nodeId={id} />
            )
          )}
        </div>
      )}
      <h1 className={styles.title}>{variant}</h1>
      <output className={styles.value}>{value}</output>
      {ports.filter((port) => port.kind === PortKind.Output).length <
      1 ? null : (
        <div className={styles.outputs}>
          {ports.map((port) =>
            port.kind !== PortKind.Output ? null : (
              <Port {...port} key={port.id} nodeId={id} />
            )
          )}
        </div>
      )}
    </article>
  )
}
