import { initialGraph } from '@/mocks'
import type { GraphActions } from '@/types'
import { graphReducer } from '@/utils/graph.reducer'
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'

export const GraphContext = createContext(initialGraph)

export const GraphDispatchContext = createContext<Dispatch<GraphActions>>(() => null)

export function GraphProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(graphReducer, initialGraph)
  return (
    <GraphContext.Provider value={state}>
      <GraphDispatchContext.Provider value={dispatch}>{children}</GraphDispatchContext.Provider>
    </GraphContext.Provider>
  )
}

export function useGraph() {
  return useContext(GraphContext)
}

export function useGraphDispatch() {
  return useContext(GraphDispatchContext)
}
