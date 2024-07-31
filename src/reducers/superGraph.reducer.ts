import { SuperGraphAction, SuperGraphActionTypes } from '@/actions'
import {
  EdgeStatus,
  SuperGraphState,
  MathOperation,
  NodeVariant,
  VertexKind,
  VertexStatus,
} from '@/types'

// this is here because when the border around the graph was created it messed up the svg positioning
// this is a temporary fix until a better solution is found
const gap = 18

function getCenterCoords(element: HTMLElement) {
  const { x, y, width, height } = element.getBoundingClientRect()

  //   gets the center of the element and subtracts the gap
  return {
    x: x + width * 0.5 - gap,
    y: y + height * 0.5 - gap,
  }
}

function moveActiveNode(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.GRAPH_MOUSE_MOVE }
) {
  const { nodes } = state
  const { clientX, clientY } = action.payload.event

  return nodes.map((node) => {
    const { x, y } = node.offset
    // only move active nodes
    if (!node.isDragging) return node
    return {
      ...node,
      position: {
        x: clientX - x,
        y: clientY - y,
      },
    }
  })
}

function moveStream(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.GRAPH_MOUSE_MOVE }
) {
  const { edges } = state
  const { clientX, clientY } = action.payload.event

  return edges.map((edge) => {
    // if edge is linked, update target and source
    // this should only be when moving a node with a edge attached
    if (edge.status === EdgeStatus.Connected) {
      if (edge.status === EdgeStatus.Connected) {
        const { source, target } = edge
        const { x: sourceX, y: sourceY } = getCenterCoords(source)
        if (!target) throw new Error('Invalid target')
        const { x: targetX, y: targetY } = getCenterCoords(target)

        return {
          ...edge,
          m: `${sourceX} ${sourceY}`,
          l: `${targetX} ${targetY}`,
        }
      }
      const { source, target } = edge
      const { x: sourceX, y: sourceY } = getCenterCoords(source)
      if (!target) throw new Error('Invalid target')
      const { x: targetX, y: targetY } = getCenterCoords(target)

      return {
        ...edge,
        m: `${sourceX} ${sourceY}`,
        l: `${targetX} ${targetY}`,
      }
    }

    // if edge is active, update edge line
    // this should only be when creating a new edge
    if (edge.status !== EdgeStatus.Dragging) return edge

    return {
      ...edge,
      l: `${clientX - gap} ${clientY - gap}`,
    }
  })
}

function scrollNodesOnGraph(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.GRAPH_WHEEL }
) {
  const { nodes } = state
  const { deltaX, deltaY } = action.payload.event.nativeEvent

  //   update scroll position of all nodes
  return nodes.map((node) => {
    return {
      ...node,
      scrollPosition: {
        x: node.scrollPosition.x + deltaX,
        y: node.scrollPosition.y + deltaY,
      },
    }
  })
}

function scrolledgesOnGraph(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.GRAPH_WHEEL }
) {
  const { edges } = state
  const { deltaX, deltaY } = action.payload.event.nativeEvent

  return edges.map((edge) => {
    // if edge is linked, update target and source
    // this should only be when moving a node with a edge attached
    if (edge.status === EdgeStatus.Connected) {
      const { source, target } = edge
      const { x: sourceX, y: sourceY } = getCenterCoords(source)
      if (!target) throw new Error('Invalid target')
      const { x: targetX, y: targetY } = getCenterCoords(target)

      return {
        ...edge,
        m: `${sourceX + deltaX} ${sourceY + deltaY}`,
        l: `${targetX + deltaX} ${targetY + deltaY}`,
      }
    }

    // if edge is active, update edge line
    // this should only be when creating a new edge
    if (edge.status !== EdgeStatus.Dragging) return edge

    return {
      ...edge,
    }
  })
}

// remove edges that are not linked to a vertex
function removeUnlinkedStreams(state: SuperGraphState) {
  const { edges } = state

  return edges
    .map((edge) => {
      // if edge is linked, update target and source
      // this should only be when moving a node with a edge attached
      if (edge.status === EdgeStatus.Connected) {
        const { source, target } = edge
        const { x: sourceX, y: sourceY } = getCenterCoords(source)
        if (!target) throw new Error('Invalid target')
        const { x: targetX, y: targetY } = getCenterCoords(target)

        return {
          ...edge,
          m: `${sourceX} ${sourceY}`,
          l: `${targetX} ${targetY}`,
        }
      }

      // if edge is active, update edge line
      // this should only be when creating a new edge
      if (edge.status !== EdgeStatus.Dragging) return edge

      return {
        ...edge,
      }
    })
    .filter((edge) => edge.status === EdgeStatus.Connected)
}

function resetActivePortStatus(state: SuperGraphState) {
  const { nodes } = state
  return nodes.map((node) => {
    return {
      ...node,
      vertices: node.vertices.map((vertex) => {
        if (vertex.status !== VertexStatus.Active) return vertex
        return {
          ...vertex,
          status: VertexStatus.Idle,
        }
      }),
    }
  })
}

// set dragging node status to idle
function resetDraggingNodeStatus(state: SuperGraphState) {
  const { nodes } = state
  return nodes.map((node) => {
    if (!node.isDragging) return node
    return {
      ...node,
      isDragging: false,
      isSelected: true,
    }
  })
}

function placeNodeOnGraph(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.GRAPH_DROP }
) {
  const { nodes } = state
  const { event } = action.payload
  const { clientX, clientY } = event

  // if node is not being dragged, return node status to idle
  return nodes.map((node) => {
    if (!node.isDragging)
      return {
        ...node,
        isSelected: false,
      }
    if (node.variant === NodeVariant.Math) {
      return {
        ...node,
        mathOperation: MathOperation.Addition,
        position: {
          x: clientX - node.offset.x - gap,
          y: clientY - node.offset.y - gap,
        },
        isSelected: true,
        isDragging: false,
      }
    }
    // if node is being dragged, place node on graph and change node status to selected
    return {
      ...node,
      position: {
        x: clientX - node.offset.x - gap,
        y: clientY - node.offset.y - gap,
      },
      isSelected: true,
      isDragging: false,
    }
  })
}

function initializeNode(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.NODE_DRAG_START }
) {
  const { nodes } = state
  const { event, variant } = action.payload
  const { offsetX, offsetY } = event.nativeEvent
  const { clientX, clientY } = event

  switch (variant) {
    case NodeVariant.Number: {
      return [
        ...nodes,
        {
          id: crypto.randomUUID(),
          variant: NodeVariant.Number,
          isDragging: true,
          isSelected: false,
          title: 'number',
          value: 0,
          position: {
            x: clientX,
            y: clientY,
          },
          offset: {
            x: offsetX,
            y: offsetY,
          },
          scrollPosition: {
            x: 0,
            y: 0,
          },
          vertices: [
            {
              id: crypto.randomUUID(),
              kind: VertexKind.Output,
              status: VertexStatus.Idle,
              value: 0,
            },
          ],
        },
      ]
    }
    case NodeVariant.Math: {
      return [
        ...nodes,
        {
          id: crypto.randomUUID(),
          variant: NodeVariant.Math,
          isDragging: true,
          isSelected: false,
          title: 'addition',
          value: undefined,
          mathOperation: MathOperation.Addition,
          position: {
            x: clientX,
            y: clientY,
          },
          offset: {
            x: offsetX,
            y: offsetY,
          },
          scrollPosition: {
            x: 0,
            y: 0,
          },
          vertices: [
            {
              id: crypto.randomUUID(),
              kind: VertexKind.Input,
              status: VertexStatus.Idle,
              value: 0,
            },
            {
              id: crypto.randomUUID(),
              kind: VertexKind.Input,
              status: VertexStatus.Idle,
              value: 0,
            },
            {
              id: crypto.randomUUID(),
              kind: VertexKind.Output,
              status: VertexStatus.Idle,
              value: 0,
            },
          ],
        },
      ]
    }
    default: {
      return nodes
    }
  }
}

function beginDraggingNode(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.NODE_MOUSE_DOWN }
) {
  const { nodes } = state
  const { id } = action.payload
  const { clientX, clientY } = action.payload.event

  return nodes.map((node) => {
    const { x, y } = node.position

    if (node.id !== id)
      return {
        ...node,
        isDragging: false,
        isSelected: false,
      }
    return {
      ...node,
      // this is used to keep the node in the same position relative to the mouse when dragging
      offset: {
        x: clientX - x,
        y: clientY - y,
      },
      isSelected: true,
      isDragging: true,
    }
  })
}

function activatePort(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.VERTEX_MOUSE_DOWN }
) {
  const { nodes } = state
  const { id } = action.payload

  return nodes.map((node) => {
    return {
      ...node,
      vertices: node.vertices.map((vertex) => {
        if (vertex.id !== id) return vertex
        if (vertex.status === VertexStatus.Connected) return vertex
        return {
          ...vertex,
          status: VertexStatus.Active,
        }
      }),
    }
  })
}

function InitializeStream(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.VERTEX_MOUSE_DOWN }
) {
  const { edges } = state
  const { value, ref, id } = action.payload
  if (!ref.current) throw new Error('Invalid vertex reference')
  const vertexCoords = getCenterCoords(ref.current)

  // if vertex status is connected return edges
  // if (status === PortStatus.Connected) return edges
  // if (kind !== PortKind.Output) return edges

  return [
    ...edges,
    {
      id: String(edges.length + 1),
      value: value,
      m: `${vertexCoords.x} ${vertexCoords.y}`,
      l: `${vertexCoords.x} ${vertexCoords.y}`,
      status: EdgeStatus.Dragging,
      sourceId: id,
      source: ref.current,
      target: null,
    },
  ]
}

function createPortConnection(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.VERTEX_MOUSE_UP }
) {
  const { nodes, edges } = state
  const { id } = action.payload

  return nodes.map((node) => {
    return {
      ...node,
      vertices: node.vertices.map((vertex) => {
        // if vertex is active set status to linked
        // the active vertex should always be the source of the edge
        if (vertex.status === VertexStatus.Active)
          return {
            ...vertex,
            status: VertexStatus.Connected,
          }
        // if the vertex is vertex set status to linked and set value to the edge value
        if (vertex.id !== id) return vertex
        return {
          ...vertex,
          status: VertexStatus.Connected,
          value: edges.find((edge) => edge.status === EdgeStatus.Dragging)
            ?.value,
        }
      }),
    }
  })
}

function createStreamConnection(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.VERTEX_MOUSE_UP }
) {
  const { edges } = state
  const { ref, id } = action.payload

  if (!ref.current) throw new Error('Invalid vertex reference')
  const { x: targetPortX, y: targetPortY } = getCenterCoords(ref.current)

  return edges.map((edge) => {
    if (edge.status !== EdgeStatus.Dragging) return edge

    return {
      ...edge,
      status: EdgeStatus.Connected,
      l: `${targetPortX} ${targetPortY}`,
      target: ref.current,
      targetId: id,
    }
  })
}

function numberNodeSliderChange(
  state: SuperGraphState,
  action: SuperGraphAction & {
    type: SuperGraphActionTypes.NUMBER_NODE_SLIDER_CHANGE
  }
) {
  const { nodes } = state
  const { id } = action.payload
  const { value } = action.payload.event.target
  return nodes.map((node) => {
    if (node.id !== id) return node
    return {
      ...node,
      value: value,
    }
  })
}

// data flows from the output of a node it's output vertex
// edges are used to connect the output vertex to the input vertex of another node
// when the value of the node changes, the value of the output vertex changes
// and flows through the edge to the input vertex of the connected node
function nodeValueChange(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.NODE_VALUE_CHANGE }
) {
  const { nodes } = state
  const { id, value } = action.payload
  // pass the new value to the output vertex
  return nodes.map((node) => {
    if (node.id !== id) return node
    return {
      ...node,
      vertices: node.vertices.map((vertex) => {
        if (vertex.kind !== VertexKind.Output) return vertex
        return {
          ...vertex,
          value: Number(value),
        }
      }),
    }
  })
}

function vertexValueChange(state: SuperGraphState) {
  const { nodes } = state
  return nodes.map((node) => {
    if (node.variant !== NodeVariant.Math) return node
    return {
      ...node,
      // value: Number(node.vertices[0].value) + Number(node.vertices[1].value),
      value: mathOperations(
        Number(node.vertices[0].value),
        Number(node.vertices[1].value),
        node.mathOperation as MathOperation
      ),
    }
  })
}

function updateStreamOnPortValueChange(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.VERTEX_VALUE_CHANGE }
) {
  const { edges } = state
  const { value, id } = action.payload
  // pass the new value to the connected edge
  return edges.map((edge) => {
    if (edge.sourceId !== id) return edge
    return {
      ...edge,
      value: value,
    }
  })
}

function edgeValueChange(
  state: SuperGraphState,
  action: SuperGraphAction & { type: SuperGraphActionTypes.EDGE_VALUE_CHANGE }
) {
  const { nodes } = state
  const { value, targetId } = action.payload

  // pass the new value to the target vertex
  return nodes.map((node) => {
    return {
      ...node,
      vertices: node.vertices.map((vertex) => {
        if (vertex.id !== targetId) return vertex

        return {
          ...vertex,
          value: value,
        }
      }),
    }
  })
}

function mathOperations(a: number, b: number, operation: MathOperation) {
  switch (operation) {
    case MathOperation.Addition:
      return a + b
    case MathOperation.Subtraction:
      return a - b
    case MathOperation.Multiplication:
      return a * b
    case MathOperation.Division:
      return a / b
    case MathOperation.Power:
      return a ** b
    case MathOperation.Modulo:
      return a % b
    default:
      return 0
  }
}

function mathNodeOperationChange(
  state: SuperGraphState,
  action: SuperGraphAction & {
    type: SuperGraphActionTypes.MATH_NODE_OPERATION_CHANGE
  }
) {
  const { nodes } = state
  const { event, id } = action.payload
  const target = event.target as HTMLSelectElement
  const { value } = target

  return nodes.map((node) => {
    if (node.id !== id) return node
    return {
      ...node,
      mathOperation: value as MathOperation,
      title: target.options[target.selectedIndex].text,
      value: mathOperations(
        Number(node.vertices[0].value),
        Number(node.vertices[1].value),
        value as MathOperation
      ),
    }
  })
}

export function superGraphReducer(
  state: SuperGraphState,
  action: SuperGraphAction
): SuperGraphState {
  switch (action.type) {
    case SuperGraphActionTypes.GRAPH_MOUSE_MOVE: {
      return {
        ...state,
        nodes: moveActiveNode(state, action),
        edges: moveStream(state, action),
      }
    }
    case SuperGraphActionTypes.GRAPH_WHEEL: {
      return {
        ...state,
        nodes: scrollNodesOnGraph(state, action),
        edges: scrolledgesOnGraph(state, action),
      }
    }
    case SuperGraphActionTypes.GRAPH_MOUSE_UP: {
      return {
        ...state,
        nodes: resetActivePortStatus(state),
        edges: removeUnlinkedStreams(state),
      }
    }
    case SuperGraphActionTypes.GRAPH_MOUSE_LEAVE: {
      return {
        ...state,
        nodes: resetDraggingNodeStatus(state),
        edges: removeUnlinkedStreams(state),
      }
    }
    case SuperGraphActionTypes.GRAPH_DROP: {
      return {
        ...state,
        nodes: placeNodeOnGraph(state, action),
      }
    }
    case SuperGraphActionTypes.NODE_DRAG_START: {
      return {
        ...state,
        nodes: initializeNode(state, action),
      }
    }
    case SuperGraphActionTypes.NODE_MOUSE_UP: {
      return {
        ...state,
        nodes: resetDraggingNodeStatus(state),
      }
    }
    case SuperGraphActionTypes.NODE_MOUSE_DOWN: {
      return {
        ...state,
        nodes: beginDraggingNode(state, action),
      }
    }
    case SuperGraphActionTypes.VERTEX_MOUSE_DOWN: {
      return {
        ...state,
        nodes: activatePort(state, action),
        edges: InitializeStream(state, action),
      }
    }
    case SuperGraphActionTypes.VERTEX_MOUSE_UP: {
      return {
        ...state,
        nodes: createPortConnection(state, action),
        edges: createStreamConnection(state, action),
      }
    }
    case SuperGraphActionTypes.NUMBER_NODE_SLIDER_CHANGE: {
      return {
        ...state,
        nodes: numberNodeSliderChange(state, action),
      }
    }
    case SuperGraphActionTypes.NODE_VALUE_CHANGE: {
      return {
        ...state,
        nodes: nodeValueChange(state, action),
      }
    }
    case SuperGraphActionTypes.VERTEX_VALUE_CHANGE: {
      return {
        ...state,
        nodes: vertexValueChange(state),
        edges: updateStreamOnPortValueChange(state, action),
      }
    }
    case SuperGraphActionTypes.EDGE_VALUE_CHANGE: {
      return {
        ...state,
        nodes: edgeValueChange(state, action),
      }
    }
    case SuperGraphActionTypes.MATH_NODE_OPERATION_CHANGE: {
      return {
        ...state,
        nodes: mathNodeOperationChange(state, action),
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${SuperGraphActionTypes}`)
    }
  }
}
