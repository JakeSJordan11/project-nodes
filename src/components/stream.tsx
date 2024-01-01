'use client'

import { useGraph } from '@/contexts/graph.povider'
import type { StreamProps } from '@/types/stream'
import { useEffect } from 'react'

export function Stream({ m, l, value, targetId }: StreamProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    if (!targetId) return
    dispatch({
      type: 'stream_value_change',
      payload: {
        value: value,
        targetId: targetId,
      },
    })
  }, [value, targetId, dispatch])

  return <path d={`M ${m} L ${l}`} />
}
