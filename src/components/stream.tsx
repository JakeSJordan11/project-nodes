'use client'

import { useGraph } from '@/contexts/graph.povider'
import { GraphActionTypes } from '@/enums/graph'
import type { StreamProps } from '@/types/stream'
import { useEffect } from 'react'

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
