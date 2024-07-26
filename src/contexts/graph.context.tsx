'use client'

import { GraphAction } from '@/actions/graph.actions'
import { GraphState } from '@/types/graph.types'
import { createContext, type Dispatch } from 'react'

export const GraphsContext = createContext<GraphState | null>(null)
export const GraphsDispatchContext =
  createContext<Dispatch<GraphAction> | null>(null)
