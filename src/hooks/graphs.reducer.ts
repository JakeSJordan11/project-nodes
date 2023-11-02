import { GraphAction, GraphState } from "@/types/graph";
import { NodeKind, NodeStatus, NodeVariant } from "@/types/node";
import { PortKind, PortStatus } from "@/types/port";
import { StreamStatus } from "@/types/stream";

export function graphsReducer(
  state: GraphState,
  action: GraphAction
): GraphState {
  switch (action.type) {
    case "graph_pointer_down": {
      const { ContextMenu } = state;
      if (state.ContextMenu.hidden) return state;
      return {
        ...state,
        ContextMenu: {
          ...ContextMenu,
          hidden: true,
        },
      };
    }
    case "graph_pointer_move": {
      const { clientX, clientY } = action.payload.event;
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.status !== NodeStatus.Active) return node;
          const { x, y } = node.offset;
          return {
            ...node,
            position: {
              x: clientX - x,
              y: clientY - y,
            },
          };
        }),
        streams: state.streams.map((stream) => {
          const { source, target } = stream;
          const sourceBounds = source.getBoundingClientRect();
          const targetBounds = target?.getBoundingClientRect();
          const sourceX = sourceBounds.x + sourceBounds.width * 0.5;
          const sourceY = sourceBounds.y + sourceBounds.height * 0.5;
          if (stream.status === StreamStatus.Linked) {
            if (!targetBounds) return stream;
            const targetX = targetBounds?.x + targetBounds?.width * 0.5;
            const targetY = targetBounds?.y + targetBounds?.height * 0.5;
            return {
              ...stream,
              m: `${sourceX} ${sourceY}`,
              l: `${targetX} ${targetY}`,
            };
          } else if (stream.status !== StreamStatus.Active) return stream;
          return {
            ...stream,
            l: `${clientX} ${clientY}`,
          };
        }),
      };
    }
    case "graph_pointer_up": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          return {
            ...node,
            status: NodeStatus.Idle,
          };
        }),
        streams: state.streams.filter(
          (stream) => stream.status === StreamStatus.Linked
        ),
      };
    }
    case "graph_pointer_leave": {
      return {
        ...state,
      };
    }
    case "graph_menu_show": {
      const { ContextMenu } = state;
      const { event } = action.payload;
      event.preventDefault();
      const { clientX, clientY } = event;
      return {
        ...state,
        ContextMenu: {
          ...ContextMenu,
          position: {
            x: clientX,
            y: clientY,
          },
          hidden: false,
        },
      };
    }
    case "graph_menu_item_pointer_down": {
      const { nodes } = state;
      const target = action.payload.event.target as HTMLElement;
      const { x, y } = state.ContextMenu.position;
      switch (target.textContent) {
        case NodeVariant.Integer: {
          return {
            ...state,
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
                title: NodeVariant.Addition,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    kind: PortKind.Output,
                    value: 0,
                    status: PortStatus.Idle,
                  },
                ],
              },
            ],
          };
        }
        case NodeVariant.Addition: {
          return {
            ...state,
            nodes: [
              ...nodes,
              {
                id: crypto.randomUUID(),
                kind: NodeKind.Operator,
                variant: NodeVariant.Addition,
                position: {
                  x: x,
                  y: y,
                },
                value: undefined,
                offset: { x: 0, y: 0 },
                status: NodeStatus.Idle,
                title: NodeVariant.Addition,
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
          };
        }
      }
      return state;
    }
    case "node_pointer_down": {
      const { nodes } = state;
      const { clientX, clientY } = action.payload.event;
      const { id } = action.payload;
      return {
        ...state,
        nodes: nodes.map((node) => {
          const { x, y } = node.position;
          if (node.id !== id) return node;
          return {
            ...node,
            offset: {
              x: clientX - x,
              y: clientY - y,
            },
            status: NodeStatus.Active,
          };
        }),
      };
    }
    case "port_pointer_down": {
      const { streams } = state;
      const { value, ref } = action.payload;
      if (!ref.current) throw new Error("Invalid port reference");
      const { x, y, width, height } = ref.current.getBoundingClientRect();
      return {
        ...state,
        streams: [
          ...streams,
          {
            id: crypto.randomUUID(),
            value: value,
            m: `${x + width * 0.5} ${y + height * 0.5}`,
            l: `${x + width * 0.5} ${y + height * 0.5}`,
            status: StreamStatus.Active,
            source: ref.current,
            target: null,
          },
        ],
      };
    }
    case "port_pointer_up": {
      const { ref } = action.payload;
      if (!ref.current) throw new Error("Invalid port reference");
      const { x, y, width, height } = ref.current.getBoundingClientRect();
      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (stream.status !== StreamStatus.Active) return stream;
          return {
            ...stream,
            status: StreamStatus.Linked,
            l: `${x + width * 0.5} ${y + height * 0.5}`,
            target: ref.current,
          };
        }),
      };
    }
    case "node_slider_change": {
      const { id } = action.payload;
      const { valueAsNumber } = action.payload.event.target as HTMLInputElement;
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== id) return node;
          return {
            ...node,
            value: valueAsNumber,
          };
        }),
      };
    }
    default:
      throw new Error("Unknown action");
  }
}
