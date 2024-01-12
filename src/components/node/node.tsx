'use client'

import { useEffect, type PointerEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import { Port, PortKind, type PortProps } from '../port'
import styles from './node.module.css'

export enum NodeKind {
  Input = 'input',
  Operator = 'operator',
}

export enum NodeVariant {
  Number = 'number',
  Math = 'math',
}

export enum NodeStatus {
  Idle = 'idle',
  Active = 'active',
}

export interface NodeProps {
  id: string | undefined
  value: number | boolean | string | undefined
  kind: NodeKind
  variant: NodeVariant
  position: { x: number; y: number }
  offset: { x: number; y: number }
  status: NodeStatus
  ports: PortProps[]
  selected?: boolean
  scrollPosition: { x: number; y: number }
}

export function Node({
  scrollPosition,
  id,
  value,
  position,
  variant,
  ports,
}: NodeProps) {
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

  return (
    <article
      className={styles.node}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        left: position.x + scrollPosition.x,
        top: position.y + scrollPosition.y,
      }}
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
