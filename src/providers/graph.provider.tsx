'use client'

import { GraphsContext, GraphsDispatchContext } from '@/contexts/graph.context'
import { graphReducer } from '@/reducers/graph.reducer'
import { GraphState } from '@/types/graph.types'
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
