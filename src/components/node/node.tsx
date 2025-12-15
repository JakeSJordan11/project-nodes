'use client'

import { MouseEvent, useEffect, useMemo, type PointerEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import { Port, PortKind, type PortProps } from '../port'
import styles from './node.module.css'
import { Noise1 } from './variants/noise1'
import { Noise2 } from './variants/noise2'
import { Blend } from './variants/blend'

export enum NodeVariant {
  Number = 'number',
  Math = 'math',
  Noise1 = 'noise 1',
  Noise2 = 'noise 2',
  Blend = 'blend',
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
  variant: NodeVariant
  title: string
  mathOperation?: MathOperation
  isDragging: boolean // TODO: derive this state from node variant
  isSelected: boolean // TODO: derive this state from node variant

  value: any // TODO: derive this state from node variant
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
  variant,
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
      <div className={styles.inputs}>
        {ports
          .filter((port) => port.kind === PortKind.Input)
          .map((port) => (
            <Port {...port} key={port.id} />
          ))}
      </div>
      <h1 className={styles.title}>{title}</h1>
      {variant === NodeVariant.Noise1 ? (
        <Noise1 canvasStyle={styles.canvas} />
      ) : variant === NodeVariant.Noise2 ? (
        <Noise2 canvasStyle={styles.canvas} />
      ) : variant === NodeVariant.Blend ? (
        <Blend canvasStyle={styles.canvas} />
      ) : (
        <output className={styles.value}>{value}</output>
      )}
      <div className={styles.outputs}>
        {ports
          .filter((port) => port.kind === PortKind.Output)
          .map((port) => (
            <Port {...port} key={port.id} />
          ))}
      </div>
    </article>
  )
}
