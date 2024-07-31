import { SuperGraphsContext, SuperGraphsDispatchContext } from '@/contexts'
import { useContext } from 'react'

export function useSuperGraph() {
  const state = useContext(SuperGraphsContext)
  const dispatch = useContext(SuperGraphsDispatchContext)
  if (!state || !dispatch) {
    throw new Error('useSuperGraph must be used within a GraphProvider')
  }
  return { state, dispatch }
}
