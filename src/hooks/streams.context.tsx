import type { StreamAction, StreamState } from '@/types/stream'
import { streamReducer } from '@/utils/stream.reducer'
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'

const initialState: StreamState = []
export const StreamContext = createContext(initialState)

export const StreamDispatchContext = createContext<Dispatch<StreamAction>>(
  () => null
)

export default function StreamProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(streamReducer, initialState)
  return (
    <StreamContext.Provider value={state}>
      <StreamDispatchContext.Provider value={dispatch}>
        {children}
      </StreamDispatchContext.Provider>
    </StreamContext.Provider>
  )
}

export function useStreams() {
  return useContext(StreamContext)
}

export function useStreamsDispatch() {
  return useContext(StreamDispatchContext)
}
