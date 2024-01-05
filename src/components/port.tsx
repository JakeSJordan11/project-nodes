'use client'

import { useGraph } from '@/contexts/graph.povider'
import { GraphActionTypes } from '@/enums/graph'
import styles from '@/styles/port.module.css'
import type { PortProps } from '@/types/port'
import { useEffect, useRef, type MouseEvent } from 'react'

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
      ref={ref}
      className={styles.port}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
}
