'use client'

import { vertexMouseDown, vertexMouseUp, vertexValueChange } from '@/actions'
import { useSuperGraph } from '@/hooks'
import { VertexProps } from '@/types'
import { useEffect, useMemo, useRef, type MouseEvent } from 'react'
import styles from './Vertex.module.css'

export function Vertex({ id, value, nodeId }: VertexProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { dispatch } = useSuperGraph()
  const memoizedPayload = useMemo(
    () => ({ value, id, nodeId }),
    [value, id, nodeId]
  )

  useEffect(() => {
    dispatch(vertexValueChange(memoizedPayload))
  }, [memoizedPayload, dispatch])

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch(vertexMouseDown(event, id, value, ref, nodeId))
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch(vertexMouseUp(event, id, value, ref))
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
