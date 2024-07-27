'use client'

import { GraphsContext, GraphsDispatchContext } from '@/contexts'
import { graphReducer } from '@/reducers'
import { GraphState } from '@/types'
import { ReactNode, useReducer } from 'react'

export function GraphProvider({ children }: { children: ReactNode }) {
  const initialState: GraphState = {
    nodes: [],
    edges: [],
  }
  const [state, dispatch] = useReducer(graphReducer, initialState)
  return (
    <GraphsContext.Provider value={state}>
      <GraphsDispatchContext.Provider value={dispatch}>
        {children}
      </GraphsDispatchContext.Provider>
    </GraphsContext.Provider>
  )
}
