import { GraphAction, GraphState } from '@/types/graph'
import { NodeKind, NodeStatus, NodeVariant } from '@/types/node'
import { PortKind, PortStatus } from '@/types/port'
import { StreamStatus } from '@/types/stream'

export function graphsReducer(
  state: GraphState,
  action: GraphAction
): GraphState {
  switch (action.type) {
    case 'graph_pointer_move': {
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
          const sourceX = sourceBounds.x + sourceBounds.width * 0.5
          const sourceY = sourceBounds.y + sourceBounds.height * 0.5

          if (stream.status === StreamStatus.Linked && targetBounds) {
            const targetX = targetBounds.x + targetBounds.width * 0.5
            const targetY = targetBounds.y + targetBounds.height * 0.5

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
            l: `${clientX} ${clientY}`,
          }
        }),
      }
    }
    case 'graph_pointer_up': {
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
        streams: streams.filter(
          (stream) => stream.status === StreamStatus.Linked
        ),
      }
    }
    case 'graph_pointer_leave': {
      const { streams } = state
      return {
        ...state,
        streams: streams.filter(
          (stream) => stream.status === StreamStatus.Linked
        ),
      }
    }
    case 'graph_menu_show': {
      const { ContextMenu } = state
      const { event } = action.payload
      const { clientX, clientY } = event
      event.preventDefault()

      return {
        ...state,
        ContextMenu: {
          ...ContextMenu,
          position: {
            x: clientX,
            y: clientY,
          },
          hidden: !ContextMenu.hidden,
        },
      }
    }
    case 'graph_menu_item_pointer_down': {
      const { nodes, ContextMenu } = state
      const target = action.payload.event.target as HTMLElement
      const { x, y } = state.ContextMenu.position

      switch (target.textContent) {
        case NodeVariant.Integer: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Input,
                variant: NodeVariant.Integer,
                position: {
                  x: x,
                  y: y,
                },
                value: 0,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Boolean: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Input,
                variant: NodeVariant.Boolean,
                position: {
                  x: x,
                  y: y,
                },
                value: false,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Float: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Input,
                variant: NodeVariant.Float,
                position: {
                  x: x,
                  y: y,
                },
                value: 0.0,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.String: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Input,
                variant: NodeVariant.String,
                position: {
                  x: x,
                  y: y,
                },
                value: '',
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Addition: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Opertator,
                variant: NodeVariant.Addition,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Subtraction: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Opertator,
                variant: NodeVariant.Subtraction,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Division: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Opertator,
                variant: NodeVariant.Division,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Multiplication: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Opertator,
                variant: NodeVariant.Multiplication,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Modulo: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Opertator,
                variant: NodeVariant.Modulo,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Power: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Opertator,
                variant: NodeVariant.Power,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Result: {
          return {
            ...state,
            ContextMenu: {
              ...ContextMenu,
              hidden: true,
            },
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Output,
                variant: NodeVariant.Result,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
      }
      return state
    }
    case 'node_pointer_down': {
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
          }
        }),
      }
    }
    case 'port_pointer_down': {
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
            id: crypto.randomUUID(),
            value: value,
            m: `${x + width * 0.5} ${y + height * 0.5}`,
            l: `${x + width * 0.5} ${y + height * 0.5}`,
            status: StreamStatus.Active,
            sourceId: id,
            source: ref.current,
            target: null,
          },
        ],
      }
    }
    case 'port_pointer_up': {
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
            l: `${x + width * 0.5} ${y + height * 0.5}`,
            target: ref.current,
            targetId: id,
          }
        }),
      }
    }
    case 'node_slider_change': {
      const { nodes } = state
      const { id, event } = action.payload
      const { value } = event.target as HTMLInputElement

      return {
        ...state,
        nodes: nodes.map((node) => {
          if (node.id !== id) return node

          return {
            ...node,
            value:
              node.variant === NodeVariant.Boolean
                ? event.target.checked
                  ? true
                  : false
                : node.variant === NodeVariant.String
                ? event.target.value
                : Number(value),
          }
        }),
      }
    }
    case 'node_value_change': {
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
    case 'port_value_change': {
      const { nodes, streams } = state
      const { value, id, nodeId } = action.payload

      return {
        ...state,
        nodes: nodes.map((node) => {
          if (node.id !== nodeId) return node
          return {
            ...node,
            value:
              node.ports[0].value &&
              node.ports[1].value &&
              node.variant === NodeVariant.Addition
                ? Number(node.ports[0].value) + Number(node.ports[1].value)
                : node.ports[0].value &&
                  node.ports[1].value &&
                  node.variant === NodeVariant.Subtraction
                ? Number(node.ports[0].value) - Number(node.ports[1].value)
                : node.ports[0].value &&
                  node.ports[1].value &&
                  node.variant === NodeVariant.Multiplication
                ? Number(node.ports[0].value) * Number(node.ports[1].value)
                : node.ports[0].value &&
                  node.ports[1].value &&
                  node.variant === NodeVariant.Division
                ? Number(node.ports[0].value) / Number(node.ports[1].value)
                : node.ports[0].value &&
                  node.ports[1].value &&
                  node.variant === NodeVariant.Modulo
                ? Number(node.ports[0].value) % Number(node.ports[1].value)
                : node.ports[0].value &&
                  node.ports[1].value &&
                  node.variant === NodeVariant.Power
                ? Number(node.ports[0].value) ** Number(node.ports[1].value)
                : value,
          }
        }),
        streams: streams.map((stream) => {
          if (stream.sourceId !== id) return stream

          return {
            ...stream,
            value: value,
          }
        }),
      }
    }
    case 'stream_value_change': {
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
    default:
      throw new Error('Unknown action')
  }
}
