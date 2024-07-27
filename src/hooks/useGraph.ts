import { GraphsContext, GraphsDispatchContext } from '@/contexts'
import { useContext } from 'react'

export function useGraph() {
  const state = useContext(GraphsContext)
  const dispatch = useContext(GraphsDispatchContext)
  if (!state || !dispatch) {
    throw new Error('useGraph must be used within a GraphProvider')
  }
  return { state, dispatch }
}
