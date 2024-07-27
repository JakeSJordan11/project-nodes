'use client'

import { edgeValueChange } from '@/actions'
import { useGraph } from '@/hooks'
import { EdgeProps } from '@/types'
import { useEffect } from 'react'

export function Edge({ m, l, value, targetId }: EdgeProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    if (!targetId) return
    dispatch(edgeValueChange({ value, targetId }))
  }, [value, targetId, dispatch])

  return <path d={`M ${m} L ${l}`} />
}
