import { EdgeProps } from '@/types/edgeTypes'
import { NodeProps } from '@/types/nodeTypes'
import { VertexProps } from '@/types/vertexTypes'
import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  RefObject,
  WheelEvent,
} from 'react'

export enum SuperGraphActionTypes {
  GRAPH_WHEEL = 'graph_wheel',
  GRAPH_MOUSE_MOVE = 'graph_mouse_move',
  GRAPH_MOUSE_UP = 'graph_mouse_up',
  GRAPH_MOUSE_LEAVE = 'graph_mouse_leave',
  GRAPH_DROP = 'graph_drop',
  NODE_DRAG_START = 'node_drag_start',
  NODE_MOUSE_UP = 'node_mouse_up',
  NODE_MOUSE_DOWN = 'node_mouse_down',
  VERTEX_MOUSE_DOWN = 'vertex_mouse_down',
  VERTEX_MOUSE_UP = 'vertex_mouse_up',
  NUMBER_NODE_SLIDER_CHANGE = 'number_node_slider_change',
  MATH_NODE_OPERATION_CHANGE = 'math_node_operation_change',
  NODE_VALUE_CHANGE = 'node_value_change',
  VERTEX_VALUE_CHANGE = 'vertex_value_change',
  EDGE_VALUE_CHANGE = 'edge_value_change',
}

export type SuperGraphAction =
  | {
      type: SuperGraphActionTypes.GRAPH_WHEEL
      payload: { event: WheelEvent<HTMLDivElement> }
    }
  | {
      type: SuperGraphActionTypes.GRAPH_MOUSE_MOVE
      payload: { event: MouseEvent<HTMLElement> }
    }
  | {
      type: SuperGraphActionTypes.GRAPH_MOUSE_UP
      payload: { event: MouseEvent<HTMLElement> }
    }
  | {
      type: SuperGraphActionTypes.GRAPH_MOUSE_LEAVE
      payload: { event: MouseEvent<HTMLElement> }
    }
  | {
      type: SuperGraphActionTypes.GRAPH_DROP
      payload: { event: DragEvent<HTMLElement> }
    }
  | {
      type: SuperGraphActionTypes.NODE_DRAG_START
      payload: {
        event: DragEvent<HTMLElement>
        variant: string
      }
    }
  | {
      type: SuperGraphActionTypes.NODE_MOUSE_DOWN
      payload: { event: MouseEvent<HTMLElement>; id: NodeProps['id'] }
    }
  | {
      type: SuperGraphActionTypes.NODE_MOUSE_UP
      payload: { event: MouseEvent<HTMLElement>; id: NodeProps['id'] }
    }
  | {
      type: SuperGraphActionTypes.VERTEX_MOUSE_DOWN
      payload: {
        event: MouseEvent<HTMLButtonElement>
        id: VertexProps['id']
        value: VertexProps['value']
        ref: RefObject<HTMLButtonElement>
        nodeId: VertexProps['nodeId']
      }
    }
  | {
      type: SuperGraphActionTypes.VERTEX_MOUSE_UP
      payload: {
        event: MouseEvent<HTMLButtonElement>
        id: VertexProps['id']
        value: VertexProps['value']
        ref: RefObject<HTMLButtonElement>
      }
    }
  | {
      type: SuperGraphActionTypes.NUMBER_NODE_SLIDER_CHANGE
      payload: { event: ChangeEvent<HTMLInputElement>; id: NodeProps['id'] }
    }
  | {
      type: SuperGraphActionTypes.NODE_VALUE_CHANGE
      payload: {
        value: number | boolean | string | undefined
        id: string | undefined
      }
    }
  | {
      type: SuperGraphActionTypes.VERTEX_VALUE_CHANGE
      payload: {
        value: VertexProps['value']
        id: VertexProps['id']
        nodeId: VertexProps['nodeId']
      }
    }
  | {
      type: SuperGraphActionTypes.EDGE_VALUE_CHANGE
      payload: {
        value: EdgeProps['value']
        targetId: EdgeProps['targetId']
      }
    }
  | {
      type: SuperGraphActionTypes.MATH_NODE_OPERATION_CHANGE
      payload: { event: ChangeEvent<HTMLSelectElement>; id: NodeProps['id'] }
    }

export function edgeValueChange({
  value,
  targetId,
}: {
  value: EdgeProps['value']
  targetId: EdgeProps['targetId']
}): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.EDGE_VALUE_CHANGE,
    payload: { value, targetId },
  }
}

export function graphMouseMove(
  event: MouseEvent<HTMLDivElement>
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.GRAPH_MOUSE_MOVE,
    payload: { event },
  }
}

export function graphMouseUp(
  event: MouseEvent<HTMLDivElement>
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.GRAPH_MOUSE_UP,
    payload: { event },
  }
}

export function graphMouseLeave(
  event: MouseEvent<HTMLDivElement>
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.GRAPH_MOUSE_LEAVE,
    payload: { event },
  }
}

export function graphDrop(event: DragEvent<HTMLDivElement>): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.GRAPH_DROP,
    payload: { event },
  }
}

export function graphWheel(
  event: WheelEvent<HTMLDivElement>
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.GRAPH_WHEEL,
    payload: { event },
  }
}

export function nodeDragStart(
  event: DragEvent<HTMLElement>,
  variant: string
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.NODE_DRAG_START,
    payload: { event, variant },
  }
}

export function nodeValueChange(memoizedPayload: {
  value: NodeProps['value']
  id: NodeProps['id']
}): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.NODE_VALUE_CHANGE,
    payload: memoizedPayload,
  }
}

export function nodeMouseDown(
  event: MouseEvent<HTMLButtonElement>,
  id: NodeProps['id']
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.NODE_MOUSE_DOWN,
    payload: { event, id },
  }
}

export function nodeMouseUp(
  event: MouseEvent<HTMLElement>,
  id: NodeProps['id']
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.NODE_MOUSE_UP,
    payload: { event, id },
  }
}

export function numberNodeSliderChange(
  event: ChangeEvent<HTMLInputElement>,
  id: NodeProps['id']
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.NUMBER_NODE_SLIDER_CHANGE,
    payload: { event, id },
  }
}

export function mathNodeOperationChange(
  event: ChangeEvent<HTMLSelectElement>,
  id: NodeProps['id']
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.MATH_NODE_OPERATION_CHANGE,
    payload: { event, id },
  }
}

export function vertexValueChange(memoizedPayload: {
  value: VertexProps['value']
  id: VertexProps['id']
  nodeId: VertexProps['nodeId']
}): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.VERTEX_VALUE_CHANGE,
    payload: memoizedPayload,
  }
}

export function vertexMouseDown(
  event: MouseEvent<HTMLButtonElement>,
  id: VertexProps['id'],
  value: VertexProps['value'],
  ref: RefObject<HTMLButtonElement>,
  nodeId: VertexProps['nodeId']
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.VERTEX_MOUSE_DOWN,
    payload: { event, id, value, ref, nodeId },
  }
}

export function vertexMouseUp(
  event: MouseEvent<HTMLButtonElement>,
  id: VertexProps['id'],
  value: VertexProps['value'],
  ref: RefObject<HTMLButtonElement>
): SuperGraphAction {
  return {
    type: SuperGraphActionTypes.VERTEX_MOUSE_UP,
    payload: { event, id, value, ref },
  }
}
