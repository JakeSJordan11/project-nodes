import type { NodeAction, NodeState } from '@/types/node'
import { nodeReducer } from '@/utils/node.reducer'
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'

const initialState: NodeState = []
export const NodeContext = createContext(initialState)

export const NodeDispatchContext = createContext<Dispatch<NodeAction>>(
  () => null
)

export default function NodeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(nodeReducer, initialState)
  return (
    <NodeContext.Provider value={state}>
      <NodeDispatchContext.Provider value={dispatch}>
        {children}
      </NodeDispatchContext.Provider>
    </NodeContext.Provider>
  )
}

export function useNodes() {
  return useContext(NodeContext)
}

export function useNodesDispatch() {
  return useContext(NodeDispatchContext)
}
