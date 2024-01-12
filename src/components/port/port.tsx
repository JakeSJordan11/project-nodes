'use client'

import { useEffect, useRef, type MouseEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import styles from './port.module.css'

export enum PortKind {
  Input = 'input',
  Output = 'output',
}

export enum PortStatus {
  Idle = 'idle',
  Active = 'active',
  Linked = 'linked',
}

export interface PortProps {
  nodeId?: string | undefined
  id: string | undefined
  value: number | boolean | string | undefined
  kind: PortKind
  status: PortStatus
}

export function Port({ id, value, nodeId }: PortProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { dispatch } = useGraph()

  useEffect(() => {
    dispatch({
      type: GraphActionTypes.PORT_VALUE_CHANGE,
      payload: { value: value, id: id, nodeId: nodeId },
    })
  }, [value, id, nodeId, dispatch])

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch({
      type: GraphActionTypes.PORT_MOUSE_DOWN,
      payload: { event: event, id: id, value: value, ref: ref },
    })
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch({
      type: GraphActionTypes.PORT_MOUSE_UP,
      payload: { event: event, id: id, value: value, ref: ref },
    })
  }

  return (
    <button
      className={styles.port}
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
}
