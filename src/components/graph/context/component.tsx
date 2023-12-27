'use client'

import { createContext, useContext, useReducer, type Dispatch } from 'react'
import { graphsReducer } from '../reducer/component'
import type { GraphAction, GraphProviderProps, GraphState } from './types'

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

export function GraphProvider({ children }: GraphProviderProps) {
  const initialState: GraphState = {
    nodes: [],
    streams: [],
    ContextMenus: {
      graph: { position: { x: 0, y: 0 }, hidden: true },
      node: { position: { x: 0, y: 0 }, hidden: true, id: '' },
    },
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
