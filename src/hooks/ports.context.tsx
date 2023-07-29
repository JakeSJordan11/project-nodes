import type { PortAction, PortState } from '@/types/port'
import { portReducer } from '@/utils/port.reducer'
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'

const initialState: PortState = []
export const PortContext = createContext(initialState)

export const PortDispatchContext = createContext<Dispatch<PortAction>>(
  () => null
)

export default function PortProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(portReducer, initialState)
  return (
    <PortContext.Provider value={state}>
      <PortDispatchContext.Provider value={dispatch}>
        {children}
      </PortDispatchContext.Provider>
    </PortContext.Provider>
  )
}

export function usePorts() {
  return useContext(PortContext)
}

export function usePortsDispatch() {
  return useContext(PortDispatchContext)
}
