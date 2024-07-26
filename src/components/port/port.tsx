'use client'

import { useGraph } from '@/hooks/useGraph'
import styles from '@/styles/port.module.css'
import { PortProps } from '@/types/port.types'
import { useEffect, useMemo, useRef, type MouseEvent } from 'react'
import { GraphActionTypes } from '../graph'

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
      className={styles.port}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
}
