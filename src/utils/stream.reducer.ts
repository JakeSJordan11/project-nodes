import {
  StreamActionType,
  type StreamAction,
  type StreamState,
} from '@/types/stream'

export function streamReducer(state: StreamState, action: StreamAction) {
  switch (action.type) {
    case StreamActionType.CreateStream:
      return state
    default:
      throw Error('Unknown action: ' + action.type)
  }
}
