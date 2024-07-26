'use client'

import { GraphActionTypes } from '@/actions/graph.actions'
import { useGraph } from '@/hooks/useGraph'
import { StreamProps } from '@/types/stream.types'
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
