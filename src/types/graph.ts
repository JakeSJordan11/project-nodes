import { GraphMenuState } from '@/types/context.menu'
import { NodeProps } from '@/types/node'
import { StreamProps } from '@/types/stream'
import { Id, Value } from '@/types/utils'
import {
  ChangeEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from 'react'

export interface GraphProviderProps {
  children: ReactNode
}

export interface GraphState {
  nodes: NodeProps[]
  streams: StreamProps[]
  ContextMenu: GraphMenuState
}

export type GraphAction =
  | {
      type: 'graph_pointer_down'
      payload: { event: PointerEvent<HTMLElement> }
    }
  | {
      type: 'graph_pointer_move'
      payload: { event: PointerEvent<HTMLElement> }
    }
  | { type: 'graph_pointer_up'; payload: { event: PointerEvent<HTMLElement> } }
  | {
      type: 'graph_pointer_leave'
      payload: { event: PointerEvent<HTMLElement> }
    }
  | {
      type: 'graph_menu_show'
      payload: { event: MouseEvent<HTMLElement> }
    }
  | {
      type: 'graph_menu_item_pointer_down'
      payload: { event: PointerEvent<HTMLElement> }
    }
  | {
      type: 'node_pointer_down'
      payload: { event: PointerEvent<HTMLElement>; id: Id }
    }
  | {
      type: 'port_pointer_down'
      payload: {
        event: PointerEvent<HTMLButtonElement>
        id: Id
        value: Value
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: 'port_pointer_up'
      payload: {
        event: PointerEvent<HTMLButtonElement>
        id: Id
        value: Value
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: 'node_slider_change'
      payload: { event: ChangeEvent<HTMLInputElement>; id: Id }
    }
  | { type: 'node_value_change'; payload: { value: Value; id: Id } }
  | { type: 'port_value_change'; payload: { value: Value; id: Id; nodeId: Id } }
  | { type: 'stream_value_change'; payload: { value: Value; targetId: Id } }
