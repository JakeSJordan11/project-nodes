'use client'

import { MouseEvent, useEffect, useMemo, type PointerEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import { Port, PortKind, type PortProps } from '../port'
import styles from './node.module.css'

export enum NodeVariant {
  Number = 'number',
  Math = 'math',
}

export enum MathOperation {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
  Modulo = '%',
  Power = '**',
}

export interface NodeProps {
  id: string
  ports: PortProps[]
  position: { x: number; y: number }
  isSelected?: boolean
  isDragging?: boolean
  variant: NodeVariant
  mathOperation?: MathOperation
  title: string

  value: number | boolean | string | undefined // TODO: derive this state from node variant
  offset: { x: number; y: number } // TODO: derive this state this may need to be created locally, but I don't think it needs to be in the global state
  scrollPosition: { x: number; y: number } // TODO: derive this state
}

export function Node({
  scrollPosition,
  id,
  value,
  position,
  ports,
  title,
}: NodeProps) {
  const { dispatch } = useGraph()
  const memoizedPayload = useMemo(() => ({ value: value, id: id }), [value, id])

  useEffect(() => {
    dispatch({
      type: GraphActionTypes.NODE_VALUE_CHANGE,
      payload: memoizedPayload,
    })
  }, [memoizedPayload, dispatch])

  function handleMouseDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: GraphActionTypes.NODE_MOUSE_DOWN,
      payload: { event: event, id: id },
    })
  }

  function handleMouseUp(event: MouseEvent<HTMLElement>) {
    dispatch({
      type: GraphActionTypes.NODE_MOUSE_UP,
      payload: { event: event, id: id },
    })
  }

  return (
    <article
      className={styles.node}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
    </article>
  )
}
