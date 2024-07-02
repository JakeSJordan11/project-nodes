'use client'

import {
  createContext,
  useContext,
  useReducer,
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type WheelEvent,
} from 'react'
import { type NodeProps } from '../node'
import { type PortProps } from '../port'
import { type StreamProps } from '../stream'
import { graphReducer } from './graph.reducer'

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
  TRANSLATION_X_CHANGE = 'translation_x_change',
  TRANSLATION_Y_CHANGE = 'translation_y_change',
}

export interface GraphState {
  nodes: NodeProps[]
  streams: StreamProps[]
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
  | {
      type: GraphActionTypes.TRANSLATION_X_CHANGE
      payload: { event: ChangeEvent<HTMLInputElement>; id: NodeProps['id'] }
    }
  | {
      type: GraphActionTypes.TRANSLATION_Y_CHANGE
      payload: { event: ChangeEvent<HTMLInputElement>; id: NodeProps['id'] }
    }

export const GraphsContext = createContext<GraphState | null>(null)
export const GraphsDispatchContext =
  createContext<Dispatch<GraphAction> | null>(null)

export function useGraph() {
  const state = useContext(GraphsContext)
  const dispatch = useContext(GraphsDispatchContext)
  if (!state || !dispatch) {
    throw new Error('useGraph must be used within a GraphProvider')
  }
  return { state, dispatch }
}

export function GraphProvider({ children }: { children: ReactNode }) {
  const initialState: GraphState = {
    nodes: [],
    streams: [],
  }
  const [state, dispatch] = useReducer(graphReducer, initialState)
  return (
    <GraphsContext.Provider value={state}>
      <GraphsDispatchContext.Provider value={dispatch}>
        {children}
      </GraphsDispatchContext.Provider>
    </GraphsContext.Provider>
  )
}
