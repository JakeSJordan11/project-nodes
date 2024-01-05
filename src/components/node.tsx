'use client'

import { Port } from '@/components/port'
import { useGraph } from '@/contexts/graph.povider'
import { GraphActionTypes } from '@/enums/graph'
import { NodeVariant } from '@/enums/node'
import { PortKind } from '@/enums/port'
import styles from '@/styles/node.module.css'
import type { NodeProps } from '@/types/node'
import { useEffect, type PointerEvent } from 'react'

export function Node({ id, value, position, variant, ports }: NodeProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    dispatch({
      type: GraphActionTypes.NODE_VALUE_CHANGE,
      payload: { value: value, id: id },
    })
  }, [value, id, dispatch])

  function handleMouseDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: GraphActionTypes.NODE_MOUSE_DOWN,
      payload: { event: event, id: id },
    })
  }

  function handleClick() {
    dispatch({
      type: GraphActionTypes.NODE_CLICK,
      payload: { id: id },
    })
  }

  function getValues() {
    return ports[0].value
      ? Number(ports[0].value)
      : ports[0].value && ports[1].value && variant === NodeVariant.Addition
      ? Number(ports[0].value) + Number(ports[1].value)
      : ports[0].value && ports[1].value && variant === NodeVariant.Subtraction
      ? Number(ports[0].value) - Number(ports[1].value)
      : ports[0].value &&
        ports[1].value &&
        variant === NodeVariant.Multiplication
      ? Number(ports[0].value) * Number(ports[1].value)
      : ports[0].value && ports[1].value && variant === NodeVariant.Division
      ? Number(ports[0].value) / Number(ports[1].value)
      : ports[0].value && ports[1].value && variant === NodeVariant.Modulo
      ? Number(ports[0].value) % Number(ports[1].value)
      : ports[0].value &&
        ports[1].value &&
        variant === NodeVariant.Exponentiation
      ? Number(ports[0].value) ** Number(ports[1].value)
      : value
  }

  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
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
    </article>
  )
}
