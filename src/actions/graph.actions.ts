import { NodeProps } from '@/types/node.types'
import { PortProps } from '@/types/port.types'
import { StreamProps } from '@/types/stream.types'
import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  RefObject,
  WheelEvent,
} from 'react'

export enum GraphActionTypes {
  GRAPH_WHEEL = 'graph_wheel',
  GRAPH_MOUSE_MOVE = 'graph_mouse_move',
  GRAPH_MOUSE_UP = 'graph_mouse_up',
  GRAPH_MOUSE_LEAVE = 'graph_mouse_leave',
  GRAPH_DROP = 'graph_drop',
  NODE_DRAG_START = 'node_drag_start',
  NODE_MOUSE_UP = 'node_mouse_up',
  NODE_MOUSE_DOWN = 'node_mouse_down',
  PORT_MOUSE_DOWN = 'port_mouse_down',
  PORT_MOUSE_UP = 'port_mouse_up',
  NUMBER_NODE_SLIDER_CHANGE = 'number_node_slider_change',
  MATH_NODE_OPERATION_CHANGE = 'math_node_operation_change',
  NODE_VALUE_CHANGE = 'node_value_change',
  PORT_VALUE_CHANGE = 'port_value_change',
  STREAM_VALUE_CHANGE = 'stream_value_change',
}

export type GraphAction =
  | {
      type: GraphActionTypes.GRAPH_WHEEL
      payload: { event: WheelEvent<HTMLDivElement> }
    }
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
      type: GraphActionTypes.NODE_DRAG_START
      payload: {
        event: DragEvent<HTMLElement>
        variant: string
      }
    }
  | {
      type: GraphActionTypes.NODE_MOUSE_DOWN
      payload: { event: MouseEvent<HTMLElement>; id: NodeProps['id'] }
    }
  | {
      type: GraphActionTypes.NODE_MOUSE_UP
      payload: { event: MouseEvent<HTMLElement>; id: NodeProps['id'] }
    }
  | {
      type: GraphActionTypes.PORT_MOUSE_DOWN
      payload: {
        event: MouseEvent<HTMLButtonElement>
        id: PortProps['id']
        value: PortProps['value']
        ref: RefObject<HTMLButtonElement>
        nodeId: PortProps['nodeId']
      }
    }
  | {
      type: GraphActionTypes.PORT_MOUSE_UP
      payload: {
        event: MouseEvent<HTMLButtonElement>
        id: PortProps['id']
        value: PortProps['value']
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: GraphActionTypes.NUMBER_NODE_SLIDER_CHANGE
      payload: { event: ChangeEvent<HTMLInputElement>; id: NodeProps['id'] }
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
        value: PortProps['value']
        id: PortProps['id']
        nodeId: PortProps['nodeId']
      }
    }
  | {
      type: GraphActionTypes.STREAM_VALUE_CHANGE
      payload: {
        value: StreamProps['value']
        targetId: StreamProps['targetId']
      }
    }
  | {
      type: GraphActionTypes.MATH_NODE_OPERATION_CHANGE
      payload: { event: ChangeEvent<HTMLSelectElement>; id: NodeProps['id'] }
    }
