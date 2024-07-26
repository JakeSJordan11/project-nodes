'use client'

import { GraphActionTypes } from '@/actions/graph.actions'
import { useGraph } from '@/hooks/useGraph'
import styles from '@/styles/vertex.module.css'
import { VertexProps } from '@/types/vertex.types'
import { useEffect, useMemo, useRef, type MouseEvent } from 'react'

export function Vertex({ id, value, nodeId }: VertexProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { dispatch } = useGraph()
  const memoizedPayload = useMemo(
    () => ({ value: value, id: id, nodeId: nodeId }),
    [value, id, nodeId]
  )

  useEffect(() => {
    dispatch({
      type: GraphActionTypes.VERTEX_VALUE_CHANGE,
      payload: memoizedPayload,
    })
  }, [memoizedPayload, dispatch])

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch({
      type: GraphActionTypes.VERTEX_MOUSE_DOWN,
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
      type: GraphActionTypes.VERTEX_MOUSE_UP,
      payload: { event: event, id: id, value: value, ref: ref },
    })
  }

  return (
    <button
      ref={ref}
      className={styles.vertex}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
}
