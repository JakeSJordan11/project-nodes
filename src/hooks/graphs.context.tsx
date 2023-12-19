import { GraphAction, GraphProviderProps, GraphState } from '@/types/graph'
import { Dispatch, createContext, useContext, useReducer } from 'react'
import { graphsReducer } from './graphs.reducer'

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
      node: { position: { x: 0, y: 0 }, hidden: true },
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
