'use client'

import { useEffect, useMemo, useRef, type MouseEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import styles from './port.module.css'

export enum PortKind {
  Input = 'input',
  Output = 'output',
}

export enum PortStatus {
  Idle = 'idle',
  Active = 'active',
  Connected = 'connected',
}

export interface PortProps {
  id: string
  status: PortStatus
  kind: PortKind // TODO: derive this state from node kind operators have inputs and outputs, numbers have inputs
  nodeId?: string | undefined // this is duplicated state, I should be able to derive this from the global state of the node
  value: number | boolean | string | undefined // TODO: derive this state from node variant
}

export function Port({ id, value, nodeId }: PortProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { dispatch } = useGraph()
  const memoizedPayload = useMemo(
    () => ({ value: value, id: id, nodeId: nodeId }),
    [value, id, nodeId]
  )

  useEffect(() => {
    dispatch({
      type: GraphActionTypes.PORT_VALUE_CHANGE,
      payload: memoizedPayload,
    })
  }, [memoizedPayload, dispatch])

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch({
      type: GraphActionTypes.PORT_MOUSE_DOWN,
      payload: {
        event: event,
        id: id,
        value: value,
        ref: ref,
        nodeId: nodeId,
      },
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
      ref={ref}
      name='port'
      className={styles.port}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
}
