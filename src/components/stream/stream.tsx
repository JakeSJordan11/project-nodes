'use client'

import { useEffect } from 'react'
import { GraphActionTypes, useGraph } from '../graph'

export enum StreamStatus {
  Dragging = 'active',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface StreamProps {
  id: string | undefined
  m: string
  l?: string
  status: StreamStatus

  // this is duplicated state, I should be able to derive this from the global state of the port
  // but I have not figured out how to do that yet for the streams
  value: number | boolean | string | undefined // this is duplicate state as well because it is the same as it's linked port value which is in state
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
