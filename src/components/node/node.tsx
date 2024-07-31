'use client'

import { nodeMouseDown, nodeMouseUp, nodeValueChange } from '@/actions'
import { Vertex } from '@/components'
import { useSuperGraph } from '@/hooks'
import { NodeProps, VertexKind } from '@/types'
import { MouseEvent, useEffect, useMemo, type PointerEvent } from 'react'
import styles from './Node.module.css'

export function Node({
  scrollPosition,
  id,
  value,
  position,
  vertices,
  title,
}: NodeProps) {
  const { dispatch } = useSuperGraph()
  const memoizedPayload = useMemo(() => ({ value, id }), [value, id])

  useEffect(() => {
    dispatch(nodeValueChange(memoizedPayload))
  }, [memoizedPayload, dispatch])

  function handleMouseDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch(nodeMouseDown(event, id))
  }

  function handleMouseUp(event: MouseEvent<HTMLElement>) {
    dispatch(nodeMouseUp(event, id))
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
