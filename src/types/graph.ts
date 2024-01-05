import { GraphActionTypes } from '@/enums/graph'
import type { NodeProps } from '@/types/node'
import type { StreamProps } from '@/types/stream'
import type { ChangeEvent, DragEvent, MouseEvent, RefObject } from 'react'

export interface GraphState {
  nodes: NodeProps[]
  streams: StreamProps[]
}

export type GraphAction =
  | {
      type: GraphActionTypes.GRAPH_MOUSE_MOVE
      payload: { event: MouseEvent<HTMLElement> }
    }
  | {
      type: GraphActionTypes.GRAPH_MOUSE_UP
      payload: { event: MouseEvent<HTMLElement> }
    }
  | {
      type: GraphActionTypes.GRAPH_MOUSE_LEAVE
      payload: { event: MouseEvent<HTMLElement> }
    }
  | {
      type: GraphActionTypes.GRAPH_DROP
      payload: { event: DragEvent<HTMLElement> }
    }
  | {
      type: GraphActionTypes.NODE_CLICK
      payload: { id: string | undefined }
    }
  | {
      type: GraphActionTypes.NODE_MOUSE_DOWN
      payload: { event: MouseEvent<HTMLElement>; id: string | undefined }
    }
  | {
      type: GraphActionTypes.PORT_MOUSE_DOWN
      payload: {
        event: MouseEvent<HTMLButtonElement>
        id: string | undefined
        value: number | boolean | string | undefined
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: GraphActionTypes.PORT_MOUSE_UP
      payload: {
        event: MouseEvent<HTMLButtonElement>
        id: string | undefined
        value: number | boolean | string | undefined
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: GraphActionTypes.NODE_SLIDER_CHANGE
      payload: { event: ChangeEvent<HTMLInputElement>; id: string | undefined }
    }
  | {
      type: GraphActionTypes.NODE_COLOR_CHANGE
      payload: { event: ChangeEvent<HTMLInputElement>; id: string | undefined }
    }
  | {
      type: GraphActionTypes.NODE_VALUE_CHANGE
      payload: {
        value: number | boolean | string | undefined
        id: string | undefined
      }
    }
  | {
      type: GraphActionTypes.PORT_VALUE_CHANGE
      payload: {
        value: number | boolean | string | undefined
        id: string | undefined
        nodeId: string | undefined
      }
    }
  | {
      type: GraphActionTypes.STREAM_VALUE_CHANGE
      payload: {
        value: number | boolean | string | undefined
        targetId: string | undefined
      }
    }
