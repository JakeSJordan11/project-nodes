import { PortActionType, type PortAction, type PortState } from '@/types/port'

export function portReducer(state: PortState, action: PortAction) {
  switch (action.type) {
    case PortActionType.PortPointerDown:
      return state

    default:
      throw Error('Unknown action: ' + action.type)
  }
}
