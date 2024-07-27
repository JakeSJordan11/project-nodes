'use client'

import { GraphAction } from '@/actions'
import { GraphState } from '@/types'
import { createContext, type Dispatch } from 'react'

export const GraphsContext = createContext<GraphState | null>(null)
export const GraphsDispatchContext =
  createContext<Dispatch<GraphAction> | null>(null)
