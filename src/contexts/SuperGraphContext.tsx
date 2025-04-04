'use client'

import { SuperGraphAction } from '@/actions'
import { SuperGraphState } from '@/types'
import { createContext, type Dispatch } from 'react'

export const SuperGraphsContext = createContext<SuperGraphState | null>(null)
export const SuperGraphsDispatchContext =
  createContext<Dispatch<SuperGraphAction> | null>(null)
