'use client'

import { graphsReducer } from '@/contexts/graph.reducer'
import type { GraphAction, GraphState } from '@/types/graph'
import {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  type Dispatch,
} from 'react'

export const GraphsContext = createContext<GraphState | null>(null)
export const GraphsDispatchContext =
  createContext<Dispatch<GraphAction> | null>(null)

export function useGraph() {
  const state = useContext(GraphsContext)
  const dispatch = useContext(GraphsDispatchContext)
  if (!state || !dispatch) {
    throw new Error('useGraph must be used within a GraphProvider')
  }
  return { state, dispatch }
}

export function GraphProvider({ children }: { children: ReactNode }) {
  const initialState: GraphState = {
    nodes: [],
    streams: [],
  }
  const [state, dispatch] = useReducer(graphsReducer, initialState)
  return (
    <GraphsContext.Provider value={state}>
      <GraphsDispatchContext.Provider value={dispatch}>
        {children}
      </GraphsDispatchContext.Provider>
    </GraphsContext.Provider>
  )
}
