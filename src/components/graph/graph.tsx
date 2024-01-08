'use client'

import {
  createContext,
  useContext,
  useReducer,
  useState,
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import styled, { keyframes } from 'styled-components'
import {
  Node,
  NodeKind,
  NodeStatus,
  NodeVariant,
  type NodeProps,
} from '../node'
import { PortKind, PortStatus } from '../port'
import { Stream, StreamStatus, type StreamProps } from '../stream'

export enum GraphActionTypes {
  GRAPH_MOUSE_MOVE = 'graph_mouse_move',
  GRAPH_MOUSE_UP = 'graph_mouse_up',
  GRAPH_MOUSE_LEAVE = 'graph_mouse_leave',
  GRAPH_DROP = 'graph_drop',
  NODE_CLICK = 'node_click',
  NODE_MOUSE_DOWN = 'node_mouse_down',
  PORT_MOUSE_DOWN = 'port_mouse_down',
  PORT_MOUSE_UP = 'port_mouse_up',
  NODE_SLIDER_CHANGE = 'node_slider_change',
  NODE_SELECTION_CHANGE = 'node_selection_change',
  NODE_VALUE_CHANGE = 'node_value_change',
  PORT_VALUE_CHANGE = 'port_value_change',
  STREAM_VALUE_CHANGE = 'stream_value_change',
}

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
  | {
      type: GraphActionTypes.NODE_SELECTION_CHANGE
      payload: { event: ChangeEvent }
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
  const [state, dispatch] = useReducer(graphsReducer, initialState)
  return (
    <GraphsContext.Provider value={state}>
      <GraphsDispatchContext.Provider value={dispatch}>
        {children}
      </GraphsDispatchContext.Provider>
    </GraphsContext.Provider>
  )
}

export function graphsReducer(
  state: GraphState,
  action: GraphAction
): GraphState {
  const gap = 18
  const nodeHeight = 128

  switch (action.type) {
    case GraphActionTypes.GRAPH_MOUSE_MOVE: {
      const { nodes, streams } = state
      const { clientX, clientY } = action.payload.event

      if (
        nodes.every((node) => node.status !== NodeStatus.Active) &&
        streams.every((stream) => stream.status !== StreamStatus.Active)
      ) {
        return state
      }

      return {
        ...state,
        nodes: nodes.map((node) => {
          const { x, y } = node.offset
          if (node.status !== NodeStatus.Active) return node

          return {
            ...node,
            position: {
              x: clientX - x,
              y: clientY - y,
            },
          }
        }),
        streams: streams.map((stream) => {
          const { source, target } = stream
          const sourceBounds = source.getBoundingClientRect()
          const targetBounds = target?.getBoundingClientRect()
          const sourceX = sourceBounds.x + sourceBounds.width * 0.5 - gap
          const sourceY = sourceBounds.y + sourceBounds.height * 0.5 - gap

          if (stream.status === StreamStatus.Linked && targetBounds) {
            const targetX = targetBounds.x + targetBounds.width * 0.5 - gap
            const targetY = targetBounds.y + targetBounds.height * 0.5 - gap

            return {
              ...stream,
              m: `${sourceX} ${sourceY}`,
              l: `${targetX} ${targetY}`,
            }
          }

          if (stream.status !== StreamStatus.Active) {
            return stream
          }

          return {
            ...stream,
            l: `${clientX - gap} ${clientY - gap}`,
          }
        }),
      }
    }
    case GraphActionTypes.GRAPH_MOUSE_UP: {
      const { nodes, streams } = state
      if (
        nodes.every((node) => node.status !== NodeStatus.Active) &&
        streams.every((stream) => stream.status !== StreamStatus.Active)
      ) {
        return state
      }

      return {
        ...state,
        nodes: nodes.map((node) => {
          return {
            ...node,
            status: NodeStatus.Idle,
            ports: node.ports.map((port) => {
              if (
                port.id !==
                streams.find((stream) => stream.status === StreamStatus.Active)
                  ?.sourceId
              )
                return port
              return {
                ...port,
                status: PortStatus.Idle,
              }
            }),
          }
        }),
        streams: streams
          .map((stream) => {
            const { source, target } = stream
            const sourceBounds = source.getBoundingClientRect()
            const targetBounds = target?.getBoundingClientRect()
            const sourceX = sourceBounds.x + sourceBounds.width * 0.5 - gap
            const sourceY = sourceBounds.y + sourceBounds.height * 0.5 - gap
            const targetX =
              targetBounds && targetBounds?.x + targetBounds.width * 0.5 - gap
            const targetY =
              targetBounds && targetBounds?.y + targetBounds.height * 0.5 - gap
            return {
              ...stream,
              m: `${sourceX} ${sourceY}`,
              l: `${targetX} ${targetY}`,
            }
          })
          .filter((stream) => stream.status === StreamStatus.Linked),
      }
    }
    case GraphActionTypes.GRAPH_MOUSE_LEAVE: {
      const { streams } = state
      return {
        ...state,

        streams: streams
          .map((stream) => {
            const { source, target } = stream
            const sourceBounds = source.getBoundingClientRect()
            const targetBounds = target?.getBoundingClientRect()
            const sourceX = sourceBounds.x + sourceBounds.width * 0.5 - gap
            const sourceY = sourceBounds.y + sourceBounds.height * 0.5 - gap
            const targetX =
              targetBounds && targetBounds?.x + targetBounds.width * 0.5 - gap
            const targetY =
              targetBounds && targetBounds?.y + targetBounds.height * 0.5 - gap
            return {
              ...stream,
              m: `${sourceX} ${sourceY}`,
              l: `${targetX} ${targetY}`,
            }
          })
          .filter((stream) => stream.status === StreamStatus.Linked),
      }
    }
    case GraphActionTypes.GRAPH_DROP: {
      const { nodes } = state
      const { clientX, clientY } = action.payload.event
      const center = nodeHeight * 0.5

      switch (action.payload.event.dataTransfer.getData('node')) {
        case NodeVariant.Number: {
          return {
            ...state,
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
                kind: NodeKind.Input,
                variant: NodeVariant.Number,
                status: NodeStatus.Idle,
                value: 0,
                position: {
                  x: clientX - center,
                  y: clientY - center,
                },
                offset: {
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
                status: NodeStatus.Idle,
                value: '+',
                position: {
                  x: clientX - center,
                  y: clientY - center,
                },
                offset: {
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
      return state
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
            status: NodeStatus.Active,
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
            selected: node.id === id ? true : false,
            value: node.id === id ? node.value : node.value,
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
            status: StreamStatus.Active,
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
                streams.find((stream) => stream.status === StreamStatus.Active)
                  ?.sourceId &&
                port.id !== id
              )
                return port

              return {
                ...port,
                status: PortStatus.Linked,
                value: streams.find(
                  (stream) => stream.status === StreamStatus.Active
                )?.value,
              }
            }),
          }
        }),
        streams: streams.map((stream) => {
          if (stream.status !== StreamStatus.Active) return stream

          return {
            ...stream,
            status: StreamStatus.Linked,
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
          if (!node.selected) return node
          return {
            ...node,
            value: target.value,
          }
        }),
      }
    }
    default:
      throw new Error(`Unhandled action type: ${GraphActionTypes}`)
  }
}

const StyledGraph = styled.article<{
  backgroundPosition: { x: number; y: number }
}>`
  grid-area: graph;
  position: relative;
  overflow: hidden;
  background-color: hsla(0, 0%, 90%, 1);
  box-shadow: 4px 4px 4px 1px hsla(0, 0%, 0%, 0.33);
  border: 0.125rem solid hsla(0, 0%, 50%, 1);
  border-radius: 0.5rem;
  background-image: url(/grid.svg);
  background-position: ${({ backgroundPosition }) =>
    `${backgroundPosition.x}px ${backgroundPosition.y}px`};
`

const stream = keyframes` 
  from {
    stroke-dashoffset: 16;
  }
  to {
    stroke-dashoffset: 0;
  }
  `

const StyledSvg = styled.svg`
  width: 100%;
  height: 100%;
  background: none;
  stroke: black;
  stroke-width: 4;
  stroke-dasharray: 8;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: ${stream} 0.5s linear infinite;
`

export function Graph() {
  const { state, dispatch } = useGraph()
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    dispatch({
      type: GraphActionTypes.GRAPH_MOUSE_MOVE,
      payload: { event: event },
    })
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    dispatch({
      type: GraphActionTypes.GRAPH_MOUSE_UP,
      payload: { event: event },
    })
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
    dispatch({
      type: GraphActionTypes.GRAPH_MOUSE_LEAVE,
      payload: { event: event },
    })
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    dispatch({ type: GraphActionTypes.GRAPH_DROP, payload: { event: event } })
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  return (
    <StyledGraph
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      backgroundPosition={scrollPosition}
      onWheel={(event) => {
        setScrollPosition({
          x: scrollPosition.x + event.deltaX,
          y: scrollPosition.y + event.deltaY,
        })
      }}
    >
      {state.nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      <StyledSvg>
        {state.streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </StyledSvg>
    </StyledGraph>
  )
}
