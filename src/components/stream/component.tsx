'use client'

import { useEffect } from 'react'
import { useGraph } from '../graph/context/component'
import type { StreamProps } from './types'

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
