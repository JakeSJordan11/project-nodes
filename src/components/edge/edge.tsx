'use client'

import { GraphActionTypes } from '@/actions'
import { useGraph } from '@/hooks'
import { EdgeProps } from '@/types'
import { useEffect } from 'react'

export function Edge({ m, l, value, targetId }: EdgeProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    if (!targetId) return
    dispatch({
      type: GraphActionTypes.EDGE_VALUE_CHANGE,
      payload: {
        value: value,
        targetId: targetId,
      },
    })
  }, [value, targetId, dispatch])

  return <path d={`M ${m} L ${l}`} />
}
