import { MouseEvent, WheelEvent } from 'react'
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

function getActiveStream(streams: GraphState['streams']) {
  return streams.find((stream) => stream.status === StreamStatus.Dragging)
}

function moveActiveNode(state: GraphState, event: MouseEvent<HTMLElement>) {
  const { nodes } = state
  const { clientX, clientY } = event
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

function moveStream(state: GraphState, event: MouseEvent<HTMLElement>) {
  const { streams } = state
  const { clientX, clientY } = event

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

function scrollNodesOnGraph(state: GraphState, event: WheelEvent<HTMLElement>) {
  const { nodes } = state
  const { deltaX, deltaY } = event

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

function scrolltreamsOnGraph(state: GraphState) {
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

function removeUnlinkedStreams(streams: GraphState['streams']) {
  return streams.filter((stream) => stream.status === StreamStatus.Connected)
}

// set draggng node status to idle
function resetDraggingNodeStatus(nodes: GraphState['nodes']) {
  return nodes.map((node) => {
    if (node.status !== NodeStatus.Dragging) return node
    return {
      ...node,
      status: NodeStatus.Idle,
    }
  })
}

function placeNodeOnGraph(
  nodes: GraphState['nodes'],
  clientX: number,
  clientY: number
) {
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

export function graphReducer(
  state: GraphState,
  action: GraphAction
): GraphState {
  switch (action.type) {
    case GraphActionTypes.GRAPH_MOUSE_MOVE: {
      const { event } = action.payload
      return {
        ...state,
        nodes: moveActiveNode(state, event),
        streams: moveStream(state, event),
      }
    }
    case GraphActionTypes.GRAPH_WHEEL: {
      const { event } = action.payload
      return {
        ...state,
        nodes: scrollNodesOnGraph(state, event),
        streams: scrolltreamsOnGraph(state),
      }
    }
    case GraphActionTypes.GRAPH_MOUSE_UP: {
      const { streams } = state
      return {
        ...state,
        streams: removeUnlinkedStreams(streams),
      }
    }
    case GraphActionTypes.GRAPH_MOUSE_LEAVE: {
      const { streams, nodes } = state
      return {
        ...state,
        nodes: resetDraggingNodeStatus(nodes),
        streams: removeUnlinkedStreams(streams),
      }
    }
    case GraphActionTypes.GRAPH_DROP: {
      const { nodes } = state
      const { clientX, clientY } = action.payload.event.nativeEvent
      return {
        ...state,
        nodes: placeNodeOnGraph(nodes, clientX, clientY),
      }
    }
    case GraphActionTypes.NODE_DRAG_START: {
      const { nodes } = state
      const { event } = action.payload
      const { offsetX, offsetY } = event.nativeEvent
      const { clientX, clientY } = event
      const { variant } = action.payload
      switch (variant) {
        case NodeVariant.Number: {
          return {
            ...state,
            nodes: [
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
            ],
          }
        }
        case NodeVariant.Math: {
          return {
            ...state,
            nodes: [
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
            ],
          }
        }
      }
    }
    case GraphActionTypes.NODE_MOUSE_UP: {
      const { nodes } = state
      return {
        ...state,
        nodes: resetDraggingNodeStatus(nodes),
      }
    }
    case GraphActionTypes.NODE_MOUSE_DOWN: {
      const { nodes } = state
      const { clientX, clientY } = action.payload.event
      const { id } = action.payload
      return {
        ...state,
        nodes: nodes.map((node) => {
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
        }),
      }
    }
    case GraphActionTypes.NODE_CLICK: {
      const { nodes } = state
      const { id } = action.payload

      return {
        ...state,
        nodes: nodes.map((node) => {
          return {
            ...node,
            status: node.id === id ? NodeStatus.Selected : NodeStatus.Idle,
          }
        }),
      }
    }
    case GraphActionTypes.PORT_MOUSE_DOWN: {
      const { streams, nodes } = state
      const { value, ref, id } = action.payload

      if (!ref.current) throw new Error('Invalid port reference')
      const { x, y, width, height } = ref.current.getBoundingClientRect()

      return {
        ...state,
        nodes: nodes.map((node) => {
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
        }),
        streams: [
          ...streams,
          {
            id: String(streams.length + 1),
            value: value,
            m: `${x + width * 0.5 - gap} ${y + height * 0.5 - gap}`,
            l: `${x + width * 0.5 - gap} ${y + height * 0.5 - gap}`,
            status: StreamStatus.Dragging,
            sourceId: id,
            source: ref.current,
            target: null,
          },
        ],
      }
    }
    case GraphActionTypes.PORT_MOUSE_UP: {
      const { nodes, streams } = state
      const { ref, id } = action.payload

      if (!ref.current) throw new Error('Invalid port reference')
      const { x, y, width, height } = ref.current.getBoundingClientRect()

      return {
        ...state,
        nodes: nodes.map((node) => {
          return {
            ...node,
            ports: node.ports.map((port) => {
              if (
                streams.find(
                  (stream) => stream.status === StreamStatus.Dragging
                )?.sourceId &&
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
        }),
        streams: streams.map((stream) => {
          if (stream.status !== StreamStatus.Dragging) return stream

          return {
            ...stream,
            status: StreamStatus.Connected,
            l: `${x + width * 0.5 - gap} ${y + height * 0.5 - gap}`,
            target: ref.current,
            targetId: id,
          }
        }),
      }
    }
    case GraphActionTypes.NODE_SLIDER_CHANGE: {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id) return node

          return {
            ...node,
            value: action.payload.event.target.valueAsNumber,
          }
        }),
      }
    }
    case GraphActionTypes.NODE_VALUE_CHANGE: {
      const { nodes } = state
      const { value, id } = action.payload

      return {
        ...state,
        nodes: nodes.map((node) => {
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
        }),
      }
    }
    case GraphActionTypes.PORT_VALUE_CHANGE: {
      const { streams } = state
      const { value, id } = action.payload

      return {
        ...state,
        streams: streams.map((stream) => {
          if (stream.sourceId !== id) return stream

          return {
            ...stream,
            value: value,
          }
        }),
      }
    }
    case GraphActionTypes.STREAM_VALUE_CHANGE: {
      const { nodes } = state
      const { value, targetId } = action.payload

      return {
        ...state,
        nodes: nodes.map((node) => {
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
        }),
      }
    }
    case GraphActionTypes.NODE_SELECTION_CHANGE: {
      const { nodes } = state
      const { event } = action.payload
      const target = event.target as HTMLInputElement

      return {
        ...state,
        nodes: nodes.map((node) => {
          if (!NodeStatus.Selected) return node
          return {
            ...node,
            value: target.value,
          }
        }),
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${GraphActionTypes}`)
    }
  }
}
