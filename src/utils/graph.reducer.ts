import type { GraphActions, GraphState } from '@/types'

export function graphReducer(state: GraphState, action: GraphActions): GraphState {
  switch (action.type) {
    default:
      throw new Error('Unhandled action type ' + action.type)
  }
}
