import type { CanvasAction, CanvasState } from '@/types/canvas'
import { canvasReducer } from '@/utils/canvas.reducer'
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'

const initialState: CanvasState = { nodes: [], streams: [] }
export const CanvasContext = createContext(initialState)

export const CanvasDispatchContext = createContext<Dispatch<CanvasAction>>(
  () => null
)

export default function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState)
  return (
    <CanvasContext.Provider value={state}>
      <CanvasDispatchContext.Provider value={dispatch}>
        {children}
      </CanvasDispatchContext.Provider>
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  return useContext(CanvasContext)
}

export function useCanvasDispatch() {
  return useContext(CanvasDispatchContext)
}
