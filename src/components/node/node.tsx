'use client'

import { GraphActionTypes } from '@/actions'
import { Vertex } from '@/components'
import { useGraph } from '@/hooks'
import { NodeProps, VertexKind } from '@/types'
import { MouseEvent, useEffect, useMemo, type PointerEvent } from 'react'
import styles from './node.module.css'

export function Node({
  scrollPosition,
  id,
  value,
  position,
  vertices,
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
      payload: { event, id },
    })
  }

  function handleMouseUp(event: MouseEvent<HTMLElement>) {
    dispatch({
      type: GraphActionTypes.NODE_MOUSE_UP,
      payload: { event, id },
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
      {vertices.filter((vertex) => vertex.kind === VertexKind.Input).length <
      1 ? null : (
        <div className={styles.inputs}>
          {vertices.map((vertex) =>
            vertex.kind !== VertexKind.Input ? null : (
              <Vertex {...vertex} key={vertex.id} />
            )
          )}
        </div>
      )}
      <h1 className={styles.title}>{title}</h1>
      <output className={styles.value}>{value}</output>
      {vertices.filter((vertex) => vertex.kind === VertexKind.Output).length <
      1 ? null : (
        <div className={styles.outputs}>
          {vertices.map((vertex) =>
            vertex.kind !== VertexKind.Output ? null : (
              <Vertex {...vertex} key={vertex.id} />
            )
          )}
        </div>
      )}
    </article>
  )
}
