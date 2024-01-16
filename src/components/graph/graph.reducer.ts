import { GraphAction, GraphActionTypes, GraphState } from '.'
import { NodeKind, NodeStatus, NodeVariant } from '../node'
import { PortKind, PortStatus } from '../port'
import { StreamStatus } from '../stream'

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
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.GRAPH_MOUSE_MOVE }
) {
  const { nodes } = state
  const { clientX, clientY } = action.payload.event
  return nodes.map((node) => {
    const { x, y } = node.offset
    // only move active nodes
    if (node.status !== NodeStatus.Dragging) return node
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
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.GRAPH_MOUSE_MOVE }
) {
  const { streams } = state
  const { clientX, clientY } = action.payload.event

  return streams.map((stream) => {
    const { source, target } = stream
    const { x: sourceX, y: sourceY } = getCenterCoords(source)

    // if stream is linked, update target and source
    // this should only be when moving a node with a stream attached
    if (stream.status === StreamStatus.Connected) {
      const { x: targetX, y: targetY } = getCenterCoords(target!)

      return {
        ...stream,
        m: `${sourceX} ${sourceY}`,
        l: `${targetX} ${targetY}`,
      }
    }

    // if stream is active, update stream line
    // this should only be when creating a new stream
    if (stream.status !== StreamStatus.Dragging) return stream

    return {
      ...stream,
      l: `${clientX - gap} ${clientY - gap}`,
    }
  })
}

function scrollNodesOnGraph(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.GRAPH_WHEEL }
) {
  const { nodes } = state
  const { deltaX, deltaY } = action.payload.event

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

function scrollstreamsOnGraph(state: GraphState) {
  const { streams } = state

  return streams.map((stream) => {
    const { source, target } = stream
    const { x: sourceX, y: sourceY } = getCenterCoords(source)
    const { x: targetX, y: targetY } = getCenterCoords(target!)

    // this should be updating all linked streams when the graph is scrolled
    if (stream.status !== StreamStatus.Connected) return stream
    return {
      ...stream,
      m: `${sourceX} ${sourceY}`,
      l: `${targetX} ${targetY}`,
    }
  })
}

function removeUnlinkedStreams(state: GraphState) {
  const { streams } = state
  return streams.filter((stream) => stream.status === StreamStatus.Connected)
}

// set draggng node status to idle
function resetDraggingNodeStatus(state: GraphState) {
  const { nodes } = state
  return nodes.map((node) => {
    if (node.status !== NodeStatus.Dragging) return node
    return {
      ...node,
      status: NodeStatus.Idle,
    }
  })
}

function placeNodeOnGraph(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.GRAPH_DROP }
) {
  const { nodes } = state
  const { event } = action.payload
  const { clientX, clientY } = event

  // if node is not being dragged, return node status to idle
  return nodes.map((node) => {
    if (node.status !== NodeStatus.Dragging)
      return {
        ...node,
        status: NodeStatus.Idle,
      }
    // if node is being dragged, place node on graph and change node status to selected
    return {
      ...node,
      position: {
        x: clientX - node.offset.x - gap,
        y: clientY - node.offset.y - gap,
      },
      status: NodeStatus.Selected,
    }
  })
}

function initializeNode(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.NODE_DRAG_START }
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
          id: String(nodes.length + 1),
          kind: NodeKind.Input,
          variant: NodeVariant.Number,
          status: NodeStatus.Dragging,
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
          ports: [
            {
              id: String(nodes.length + 1),
              kind: PortKind.Output,
              status: PortStatus.Idle,
              value: 0,
            },
          ],
        },
      ] as GraphState['nodes']
    }
    case NodeVariant.Math: {
      return [
        ...nodes,
        {
          id: String(nodes.length + 1),
          kind: NodeKind.Operator,
          variant: NodeVariant.Math,
          status: NodeStatus.Dragging,
          value: '+',
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
          ports: [
            {
              id: String(nodes.length + 1),
              kind: PortKind.Input,
              status: PortStatus.Idle,
              value: 0,
            },
            {
              id: String(nodes.length + 2),
              kind: PortKind.Input,
              status: PortStatus.Idle,
              value: 0,
            },
            {
              id: String(nodes.length + 3),
              kind: PortKind.Output,
              status: PortStatus.Idle,
              value: 0,
            },
          ],
        },
      ]
    }
  }
  return {
    ...nodes,
  }
}

function nodesMouseDown(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.NODE_MOUSE_DOWN }
) {
  const { nodes } = state
  const { id } = action.payload
  const { clientX, clientY } = action.payload.event

  return nodes.map((node) => {
    const { x, y } = node.position
    if (node.id !== id) return node

    return {
      ...node,
      offset: {
        x: clientX - x,
        y: clientY - y,
      },
      status: NodeStatus.Dragging,
      position: {
        x: node.position.x,
        y: node.position.y,
      },
    }
  })
}

function selectNode(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.NODE_CLICK }
) {
  const { nodes } = state
  const { id } = action.payload
  return nodes.map((node) => {
    if (node.id !== id)
      return {
        ...node,
        status: NodeStatus.Idle,
      }
    return {
      ...node,
      status: NodeStatus.Selected,
    }
  })
}

function nodesPortMouseDown(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_MOUSE_DOWN }
) {
  const { nodes } = state
  const { id } = action.payload
  return nodes.map((node) => {
    return {
      ...node,
      ports: node.ports.map((port) => {
        if (port.id !== id) return port

        return {
          ...port,
          status: PortStatus.Active,
        }
      }),
    }
  })
}

function streamsPortMouseDown(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_MOUSE_DOWN }
) {
  const { streams } = state
  const { value, ref, id } = action.payload

  if (!ref.current) throw new Error('Invalid port reference')
  const portCoords = getCenterCoords(ref.current)
  return [
    ...streams,
    {
      id: String(streams.length + 1),
      value: value,
      m: `${portCoords.x} ${portCoords.y}`,
      l: `${portCoords.x} ${portCoords.y}`,
      status: StreamStatus.Dragging,
      sourceId: id,
      source: ref.current,
      target: null,
    },
  ]
}

function nodesPortMouseUp(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_MOUSE_UP }
) {
  const { nodes, streams } = state
  const { id } = action.payload

  return nodes.map((node) => {
    return {
      ...node,
      ports: node.ports.map((port) => {
        if (
          streams.find((stream) => stream.status === StreamStatus.Dragging)
            ?.sourceId &&
          port.id !== id
        )
          return port

        return {
          ...port,
          status: PortStatus.Linked,
          value: streams.find(
            (stream) => stream.status === StreamStatus.Dragging
          )?.value,
        }
      }),
    }
  })
}

function streamsPortMouseUp(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_MOUSE_UP }
) {
  const { streams } = state
  const { ref, id } = action.payload

  if (!ref.current) throw new Error('Invalid port reference')
  const portCoords = getCenterCoords(ref.current)

  return streams.map((stream) => {
    if (stream.status !== StreamStatus.Dragging) return stream

    return {
      ...stream,
      status: StreamStatus.Connected,
      l: `${portCoords.x} ${portCoords.y}`,
      target: ref.current,
      targetId: id,
    }
  })
}

function numberNodeSliderChange(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.NUMBER_NODE_SLIDER_CHANGE }
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

function nodeValueChange(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.NODE_VALUE_CHANGE }
) {
  const { nodes } = state
  const { id, value } = action.payload
  return nodes.map((node) => {
    if (node.id !== id) return node
    return {
      ...node,
      ports: node.ports.map((port) => {
        if (port.kind !== PortKind.Output) return port

        return {
          ...port,
          value: value,
        }
      }),
    }
  })
}

function portValueChange(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_VALUE_CHANGE }
) {
  const { streams } = state
  const { value, id } = action.payload
  return streams.map((stream) => {
    if (stream.sourceId !== id) return stream

    return {
      ...stream,
      value: value,
    }
  })
}

function streamValueChange(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.STREAM_VALUE_CHANGE }
) {
  const { nodes } = state
  const { value, targetId } = action.payload

  return nodes.map((node) => {
    return {
      ...node,
      ports: node.ports.map((port) => {
        if (port.id !== targetId) return port

        return {
          ...port,
          value: value,
        }
      }),
    }
  })
}

function mathNodeOperationChange(
  state: GraphState,
  action: GraphAction & {
    type: GraphActionTypes.MATH_NODE_OPERATION_CHANGE
  }
) {
  const { nodes } = state
  const { event } = action.payload
  const target = event.target as HTMLInputElement

  return nodes.map((node) => {
    if (!NodeStatus.Selected) return node
    return {
      ...node,
      value: target.value,
    }
  })
}

export function graphReducer(
  state: GraphState,
  action: GraphAction
): GraphState {
  switch (action.type) {
    case GraphActionTypes.GRAPH_MOUSE_MOVE: {
      return {
        ...state,
        nodes: moveActiveNode(state, action),
        streams: moveStream(state, action),
      }
    }
    case GraphActionTypes.GRAPH_WHEEL: {
      return {
        ...state,
        nodes: scrollNodesOnGraph(state, action),
        streams: scrollstreamsOnGraph(state),
      }
    }
    case GraphActionTypes.GRAPH_MOUSE_UP: {
      return {
        ...state,
        streams: removeUnlinkedStreams(state),
      }
    }
    case GraphActionTypes.GRAPH_MOUSE_LEAVE: {
      return {
        ...state,
        nodes: resetDraggingNodeStatus(state),
        streams: removeUnlinkedStreams(state),
      }
    }
    case GraphActionTypes.GRAPH_DROP: {
      return {
        ...state,
        nodes: placeNodeOnGraph(state, action),
      }
    }
    case GraphActionTypes.NODE_DRAG_START: {
      return {
        ...state,
        nodes: initializeNode(state, action),
      }
    }
    case GraphActionTypes.NODE_MOUSE_UP: {
      return {
        ...state,
        nodes: resetDraggingNodeStatus(state),
      }
    }
    case GraphActionTypes.NODE_MOUSE_DOWN: {
      return {
        ...state,
        nodes: nodesMouseDown(state, action),
      }
    }
    case GraphActionTypes.NODE_CLICK: {
      return {
        ...state,
        nodes: selectNode(state, action),
      }
    }
    case GraphActionTypes.PORT_MOUSE_DOWN: {
      return {
        ...state,
        nodes: nodesPortMouseDown(state, action),
        streams: streamsPortMouseDown(state, action),
      }
    }
    case GraphActionTypes.PORT_MOUSE_UP: {
      return {
        ...state,
        nodes: nodesPortMouseUp(state, action),
        streams: streamsPortMouseUp(state, action),
      }
    }
    case GraphActionTypes.NUMBER_NODE_SLIDER_CHANGE: {
      return {
        ...state,
        nodes: numberNodeSliderChange(state, action),
      }
    }
    case GraphActionTypes.NODE_VALUE_CHANGE: {
      return {
        ...state,
        nodes: nodeValueChange(state, action),
      }
    }
    case GraphActionTypes.PORT_VALUE_CHANGE: {
      return {
        ...state,
        streams: portValueChange(state, action),
      }
    }
    case GraphActionTypes.STREAM_VALUE_CHANGE: {
      return {
        ...state,
        nodes: streamValueChange(state, action),
      }
    }
    case GraphActionTypes.MATH_NODE_OPERATION_CHANGE: {
      return {
        ...state,
        nodes: mathNodeOperationChange(state, action),
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${GraphActionTypes}`)
    }
  }
}
