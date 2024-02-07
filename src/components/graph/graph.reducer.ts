import { GraphAction, GraphActionTypes, GraphState } from '.'
import { MathOperation, NodeKind, NodeStatus, NodeVariant } from '../node'
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
    // if stream is linked, update target and source
    // this should only be when moving a node with a stream attached
    if (stream.status === StreamStatus.Connected) {
      const { source, target } = stream
      const { x: sourceX, y: sourceY } = getCenterCoords(source)
      if (!target) throw new Error('Invalid target')
      const { x: targetX, y: targetY } = getCenterCoords(target)

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

function scrollstreamsOnGraph(state: GraphState) {
  const { streams } = state

  return streams.map((stream) => {
    const { source, target } = stream
    const { x: sourceX, y: sourceY } = getCenterCoords(source)
    if (!target) throw new Error('Invalid target')
    const { x: targetX, y: targetY } = getCenterCoords(target)

    // this should be updating all linked streams when the graph is scrolled
    if (stream.status !== StreamStatus.Connected) return stream
    return {
      ...stream,
      m: `${sourceX} ${sourceY}`,
      l: `${targetX} ${targetY}`,
    }
  })
}

// remove streams that are not linked to a port
function removeUnlinkedStreams(state: GraphState) {
  const { streams } = state
  return streams.filter((stream) => stream.status === StreamStatus.Connected)
}

function resetActivePortStatus(state: GraphState) {
  const { nodes } = state
  return nodes.map((node) => {
    return {
      ...node,
      ports: node.ports.map((port) => {
        if (port.status !== PortStatus.Active) return port
        return {
          ...port,
          status: PortStatus.Idle,
        }
      }),
    }
  })
}

// set dragging node status to idle
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
    if (node.variant === NodeVariant.Math) {
      return {
        ...node,
        mathOperation: MathOperation.Addition,
        position: {
          x: clientX - node.offset.x - gap,
          y: clientY - node.offset.y - gap,
        },
        status: NodeStatus.Selected,
      }
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
          id: crypto.randomUUID(),
          kind: NodeKind.Input,
          variant: NodeVariant.Number,
          status: NodeStatus.Dragging,
          title: 'Number',
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
              id: crypto.randomUUID(),
              kind: PortKind.Output,
              status: PortStatus.Idle,
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
          kind: NodeKind.Operator,
          variant: NodeVariant.Math,
          status: NodeStatus.Dragging,
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
          ports: [
            {
              id: crypto.randomUUID(),
              kind: PortKind.Input,
              status: PortStatus.Idle,
              value: 0,
            },
            {
              id: crypto.randomUUID(),
              kind: PortKind.Input,
              status: PortStatus.Idle,
              value: 0,
            },
            {
              id: crypto.randomUUID(),
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

function beginDraggingNode(
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
      // this is used to keep the node in the same position relative to the mouse when dragging
      offset: {
        x: clientX - x,
        y: clientY - y,
      },
      status: NodeStatus.Dragging,
    }
  })
}

function selectNode(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.NODE_CLICK }
) {
  const { nodes } = state
  const { id } = action.payload

  // set all nodes to idle except for the selected node
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

function activatePort(
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
        if (port.status === PortStatus.Connected) return port
        return {
          ...port,
          status: PortStatus.Active,
        }
      }),
    }
  })
}

function InitializeStream(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_MOUSE_DOWN }
) {
  const { streams } = state
  const { value, ref, id } = action.payload
  if (!ref.current) throw new Error('Invalid port reference')
  const portCoords = getCenterCoords(ref.current)

  // if port status is connected return streams
  // if (status === PortStatus.Connected) return streams
  // if (kind !== PortKind.Output) return streams

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

function createPortConnection(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_MOUSE_UP }
) {
  const { nodes, streams } = state
  const { id } = action.payload

  return nodes.map((node) => {
    return {
      ...node,
      ports: node.ports.map((port) => {
        // if port is active set status to linked
        // the active port should always be the source of the stream
        if (port.status === PortStatus.Active)
          return {
            ...port,
            status: PortStatus.Connected,
          }
        // if the port is port set status to linked and set value to the stream value
        if (port.id !== id) return port
        return {
          ...port,
          status: PortStatus.Connected,
          value: streams.find(
            (stream) => stream.status === StreamStatus.Dragging
          )?.value,
        }
      }),
    }
  })
}

function createStreamConnection(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_MOUSE_UP }
) {
  const { streams } = state
  const { ref, id } = action.payload

  if (!ref.current) throw new Error('Invalid port reference')
  const { x: targetPortX, y: targetPortY } = getCenterCoords(ref.current)

  return streams.map((stream) => {
    if (stream.status !== StreamStatus.Dragging) return stream

    return {
      ...stream,
      status: StreamStatus.Connected,
      l: `${targetPortX} ${targetPortY}`,
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

// data flows from the output of a node it's output port
// streams are used to connect the output port to the input port of another node
// when the value of the node changes, the value of the output port changes
// and flows through the stream to the input port of the connected node
function nodeValueChange(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.NODE_VALUE_CHANGE }
) {
  const { nodes } = state
  const { id, value } = action.payload
  // pass the new value to the output port
  return nodes.map((node) => {
    if (node.id !== id) return node
    return {
      ...node,
      ports: node.ports.map((port) => {
        if (port.kind !== PortKind.Output) return port
        return {
          ...port,
          value: Number(value),
        }
      }),
    }
  })
}

function portValueChange(state: GraphState) {
  const { nodes } = state
  return nodes.map((node) => {
    if (node.variant !== NodeVariant.Math) return node
    return {
      ...node,
      // value: Number(node.ports[0].value) + Number(node.ports[1].value),
      value: mathOperations(
        Number(node.ports[0].value),
        Number(node.ports[1].value),
        node.mathOperation as MathOperation
      ),
    }
  })
}

function updateStreamOnPortValueChange(
  state: GraphState,
  action: GraphAction & { type: GraphActionTypes.PORT_VALUE_CHANGE }
) {
  const { streams } = state
  const { value, id } = action.payload
  // pass the new value to the connected stream
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

  // pass the new value to the target port
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
  state: GraphState,
  action: GraphAction & {
    type: GraphActionTypes.MATH_NODE_OPERATION_CHANGE
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
        Number(node.ports[0].value),
        Number(node.ports[1].value),
        value as MathOperation
      ),
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
        nodes: resetActivePortStatus(state),
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
        nodes: beginDraggingNode(state, action),
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
        nodes: activatePort(state, action),
        streams: InitializeStream(state, action),
      }
    }
    case GraphActionTypes.PORT_MOUSE_UP: {
      return {
        ...state,
        nodes: createPortConnection(state, action),
        streams: createStreamConnection(state, action),
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
        nodes: portValueChange(state),
        streams: updateStreamOnPortValueChange(state, action),
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
