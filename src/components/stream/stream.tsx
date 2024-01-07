'use client'

import { useEffect } from 'react'
import { GraphActionTypes, useGraph } from '../graph'

export enum StreamStatus {
  Active = 'active',
  Linked = 'linked',
}

export interface StreamProps {
  id: string | undefined
  value: number | boolean | string | undefined
  m: string
  l?: string
  status: StreamStatus
  sourceId: string | undefined
  targetId?: string | undefined
  source: HTMLButtonElement
  target: HTMLButtonElement | null
}

export function Stream({ m, l, value, targetId }: StreamProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    if (!targetId) return
    dispatch({
      type: GraphActionTypes.STREAM_VALUE_CHANGE,
      payload: {
        value: value,
        targetId: targetId,
      },
    })
  }, [value, targetId, dispatch])

  return <path d={`M ${m} L ${l}`} />
}
