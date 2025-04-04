'use client'

import { SuperGraphsContext, SuperGraphsDispatchContext } from '@/contexts'
import { superGraphReducer } from '@/reducers'
import { SuperGraphState } from '@/types'
import { ReactNode, useReducer } from 'react'

export function SuperGraphProvider({ children }: { children: ReactNode }) {
  const initialState: SuperGraphState = {
    nodes: [],
    edges: [],
  }
  const [state, dispatch] = useReducer(superGraphReducer, initialState)
  return (
    <SuperGraphsContext.Provider value={state}>
      <SuperGraphsDispatchContext.Provider value={dispatch}>
        {children}
      </SuperGraphsDispatchContext.Provider>
    </SuperGraphsContext.Provider>
  )
}
