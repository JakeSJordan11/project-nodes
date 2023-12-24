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
    case 'graph_pointer_down': {
      const { ContextMenus } = state
      if (ContextMenus.graph.hidden && ContextMenus.node.hidden) return state
      return {
        ...state,
        ContextMenus: {
          ...ContextMenus,
          node: {
            id: ContextMenus.node.id,
            hidden: true,
            position: {
              x: ContextMenus.node.position.x,
              y: ContextMenus.node.position.y,
            },
          },
          graph: {
            hidden: true,
            position: {
              x: ContextMenus.graph.position.x,
              y: ContextMenus.graph.position.y,
            },
          },
        },
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
      const { ContextMenus } = state
      const { event } = action.payload
      const { clientX, clientY } = event
      event.preventDefault()

      return {
        ...state,
        ContextMenus: {
          ...ContextMenus,
          graph: {
            hidden: ContextMenus.node.hidden ? false : true,
            position: {
              x: clientX,
              y: clientY,
            },
          },
        },
      }
    }
    case 'graph_menu_item_pointer_down': {
      const { nodes, ContextMenus } = state
      const target = action.payload.event.target as HTMLElement
      const { x, y } = state.ContextMenus.graph.position

      switch (target.textContent) {
        case NodeVariant.Integer: {
          return {
            ...state,
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-2`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-3`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-2`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-3`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-2`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-3`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-2`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-3`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-2`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-3`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-2`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-3`,
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
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
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
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Color: {
          return {
            ...state,
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
                kind: NodeKind.Input,
                variant: NodeVariant.Color,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.WebGpu: {
          return {
            ...state,
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
                kind: NodeKind.Input,
                variant: NodeVariant.WebGpu,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Output,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          }
        }
        case NodeVariant.Blend: {
          return {
            ...state,
            ContextMenus: {
              ...ContextMenus,
              graph: {
                hidden: true,
                position: {
                  x: ContextMenus.graph.position.x,
                  y: ContextMenus.graph.position.y,
                },
              },
            },
            nodes: [
              ...nodes,
              {
                id: String(nodes.length + 1),
                kind: NodeKind.Opertator,
                variant: NodeVariant.Blend,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                ports: [
                  {
                    id: `${nodes.length + 1}-1`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-2`,
                    kind: PortKind.Input,
                    value: undefined,
                    status: PortStatus.Idle,
                  },
                  {
                    id: `${nodes.length + 1}-3`,
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
    case 'node_menu_show': {
      return {
        ...state,
        ContextMenus: {
          ...state.ContextMenus,
          node: {
            id: action.payload.id,
            hidden: false,
            position: {
              x: action.payload.event.clientX,
              y: action.payload.event.clientY,
            },
          },
        },
      }
    }
    case 'node_menu_item_pointer_down': {
      const target = action.payload.event.target as HTMLElement
      switch (target.textContent) {
        case 'delete node': {
          return {
            ...state,
            ContextMenus: {
              ...state.ContextMenus,
              node: {
                id: state.ContextMenus.node.id,
                hidden: true,
                position: {
                  x: state.ContextMenus.node.position.x,
                  y: state.ContextMenus.node.position.y,
                },
              },
            },
          }
        }
      }
      return {
        ...state,
        ContextMenus: {
          ...state.ContextMenus,
          node: {
            id: state.ContextMenus.node.id,
            hidden: true,
            position: {
              x: state.ContextMenus.node.position.x,
              y: state.ContextMenus.node.position.y,
            },
          },
        },
      }
    }
    case 'node_pointer_down': {
      const { nodes } = state
      const { clientX, clientY } = action.payload.event
      const { id } = action.payload

      return {
        ...state,
        ContextMenus: {
          ...state.ContextMenus,
          node: {
            id: state.ContextMenus.node.id,
            hidden: true,
            position: {
              x: state.ContextMenus.node.position.x,
              y: state.ContextMenus.node.position.y,
            },
          },
        },
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
            id: String(streams.length + 1),
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
              node.ports[0].value && node.variant === NodeVariant.Result
                ? Number(node.ports[0].value)
                : node.ports[0].value &&
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
    case 'node_color_change': {
      const { nodes } = state
      const { id, event } = action.payload
      const { value } = event.target as HTMLInputElement

      return {
        ...state,
        nodes: nodes.map((node) => {
          if (node.id !== id) return node

          return {
            ...node,
            value: value,
          }
        }),
      }
    }
    default:
      throw new Error('Unknown action')
  }
}
