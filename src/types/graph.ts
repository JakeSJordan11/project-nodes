import type { ContextMenuState } from '@/types/context.menu'
import type { NodeProps } from '@/types/node'
import type { StreamProps } from '@/types/stream'
import type {
  ChangeEvent,
  DragEvent,
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
  ContextMenus: ContextMenuState
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
      type: 'graph_drop'
      payload: { event: DragEvent<HTMLElement> }
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
      type: 'node_menu_show'
      payload: { event: MouseEvent<HTMLElement>; id: string | undefined }
    }
  | {
      type: 'node_menu_item_pointer_down'
      payload: { event: PointerEvent<HTMLElement> }
    }
  | {
      type: 'node_pointer_down'
      payload: { event: PointerEvent<HTMLElement>; id: string | undefined }
    }
  | {
      type: 'port_pointer_down'
      payload: {
        event: PointerEvent<HTMLButtonElement>
        id: string | undefined
        value: number | boolean | string | undefined
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: 'port_pointer_up'
      payload: {
        event: PointerEvent<HTMLButtonElement>
        id: string | undefined
        value: number | boolean | string | undefined
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: 'node_slider_change'
      payload: { event: ChangeEvent<HTMLInputElement>; id: string | undefined }
    }
  | {
      type: 'node_color_change'
      payload: { event: ChangeEvent<HTMLInputElement>; id: string | undefined }
    }
  | {
      type: 'node_value_change'
      payload: {
        value: number | boolean | string | undefined
        id: string | undefined
      }
    }
  | {
      type: 'port_value_change'
      payload: {
        value: number | boolean | string | undefined
        id: string | undefined
        nodeId: string | undefined
      }
    }
  | {
      type: 'stream_value_change'
      payload: {
        value: number | boolean | string | undefined
        targetId: string | undefined
      }
    }
