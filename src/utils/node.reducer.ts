import { NodeActionType, type NodeAction, type NodeState } from '@/types/node'

export function nodeReducer(state: NodeState, action: NodeAction) {
  switch (action.type) {
    case NodeActionType.CreateNode:
      console.log(action.payload)
      return state

    default:
      throw Error('Unknown action: ' + action.type)
  }
}
