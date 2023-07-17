import { nodeStatus, nodeTypes } from "@/constants/node";
import { portStatus, portTypes } from "@/constants/port";
import { streamStatus } from "@/constants/stream";
import { CanvasAction, CanvasState } from "@/types/canvas.reducer";
import { NodeProps } from "@/types/node";
import { StreamProps } from "@/types/stream";

export function canvasReducer(state: CanvasState, action: CanvasAction) {
  switch (action.type) {
    case "DRAG_SELECTION": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.status === "active") {
            return {
              ...node,
              position: {
                x: action.payload.x - node.offset.x,
                y: action.payload.y - node.offset.y,
              },
            };
          } else return node;
        }) as NodeProps[],
        streams: state.streams.map((stream) => {
          if (stream.status === "active") {
            return {
              ...stream,
              to: ` L${action.payload.x} ${action.payload.y}`,
            };
          } else if (stream.status === "linked") {
            return (
              stream.toRef.current &&
              stream.fromRef.current && {
                ...stream,
                from: `M${
                  stream.fromRef.current.getBoundingClientRect().x +
                  stream.fromRef.current.getBoundingClientRect().width / 2
                } ${
                  stream.fromRef.current.getBoundingClientRect().y +
                  stream.fromRef.current.getBoundingClientRect().height / 2
                }`,
                to: ` L${
                  stream.toRef.current.getBoundingClientRect().x +
                  stream.toRef.current.getBoundingClientRect().width / 2
                } ${
                  stream.toRef.current.getBoundingClientRect().y +
                  stream.toRef.current.getBoundingClientRect().height / 2
                }`,
              }
            );
          } else return stream;
        }) as StreamProps[],
      };
    }

    case "DROP_SELECTION": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (
            node.id === action.payload.id &&
            node.status === nodeStatus.active
          ) {
            return {
              ...node,
              position: {
                x: action.payload.x - node.offset.x,
                y: action.payload.y - node.offset.y,
              },
              status: nodeStatus.inactive,
            };
          } else if (
            state.streams.find((stream) => stream.status === "active")
          ) {
            return {
              ...node,
              ports: node.ports.map((port) => {
                if (
                  state.streams.find((stream) => stream.status === "active")
                    ?.fromId === port.id
                ) {
                  return {
                    ...port,
                    status: portStatus.inactive,
                  };
                } else return port;
              }),
            };
          } else return node;
        }) as NodeProps[],
        streams: state.streams
          .map((stream) => {
            if (stream.status === "active") {
              return {
                ...stream,
                status: streamStatus.inactive,
              };
            } else return stream;
          })
          .filter((stream) => stream.status === "linked"),
      };
    }

    case "CREATE_NODE": {
      if (action.payload.type === nodeTypes.number) {
        return {
          ...state,
          nodes: [
            ...state.nodes,
            {
              id: crypto.randomUUID(),
              type: nodeTypes.number,
              value: 0,
              position: {
                x: action.payload.x,
                y: action.payload.y,
              },
              ports: [
                {
                  id: crypto.randomUUID(),
                  type: portTypes.output,
                },
              ],
            },
          ] as NodeProps[],
        };
      } else if (action.payload.type === nodeTypes.operator) {
        return {
          ...state,
          nodes: [
            ...state.nodes,
            {
              id: crypto.randomUUID(),
              type: nodeTypes.operator,
              value: 0,
              position: {
                x: action.payload.x,
                y: action.payload.y,
              },
              ports: [
                {
                  id: crypto.randomUUID(),
                  type: portTypes.input,
                },
                {
                  id: crypto.randomUUID(),
                  type: portTypes.input,
                },
                {
                  id: crypto.randomUUID(),
                  type: portTypes.output,
                },
              ],
            },
          ] as NodeProps[],
        };
      } else return state;
    }

    case "SELECT_NODE": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.id) {
            return {
              ...node,
              status: nodeStatus.active,
              offset: {
                x: action.payload.x - node.position.x,
                y: action.payload.y - node.position.y,
              },
            };
          } else return node;
        }),
      };
    }

    case "UPDATE_NODE": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.id) {
            return {
              ...node,
              value: action.payload.value,
            };
          } else return node;
        }),
      };
    }

    case "CREATE_STREAM": {
      if (
        action.payload.portType === portTypes.input ||
        action.payload.portStatus === portStatus.linked
      )
        return { ...state };
      return {
        ...state,
        streams: [
          ...state.streams,
          action.payload.portRef.current && {
            id: crypto.randomUUID(),
            status: streamStatus.active,
            fromRef: action.payload.portRef,
            fromId: action.payload.id,
            fromValue: action.payload.fromValue,
            from: `M${
              action.payload.portRef.current.getBoundingClientRect().x +
              action.payload.portRef.current.getBoundingClientRect().width / 2
            } ${
              action.payload.portRef.current.getBoundingClientRect().y +
              action.payload.portRef.current.getBoundingClientRect().height / 2
            }`,
            to: ` L${
              action.payload.portRef.current.getBoundingClientRect().x +
              action.payload.portRef.current.getBoundingClientRect().width / 2
            } ${
              action.payload.portRef.current.getBoundingClientRect().y +
              action.payload.portRef.current.getBoundingClientRect().height / 2
            }`,
          },
        ] as StreamProps[],

        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.nodeId) {
            return {
              ...node,
              ports: node.ports.map((port) => {
                if (port.id === action.payload.id) {
                  return {
                    ...port,
                    status: portStatus.linked,
                  };
                } else return port;
              }),
            };
          } else return node;
        }) as NodeProps[],
      };
    }

    case "ATTEMPT_LINK": {
      if (
        action.payload.portType === portTypes.output ||
        action.payload.portStatus === portStatus.linked
      )
        return {
          ...state,
          streams: state.streams
            .map((stream) => {
              if (stream.status === streamStatus.active) {
                return {
                  ...stream,
                  status: streamStatus.inactive,
                };
              } else return stream;
            })
            .filter((stream) => stream.status === streamStatus.linked),
        };

      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (stream.status === streamStatus.active) {
            return (
              action.payload.portRef.current && {
                ...stream,
                status: streamStatus.linked,
                toRef: action.payload.portRef,
                toId: action.payload.id,
                to: ` L${
                  action.payload.portRef.current.getBoundingClientRect().x +
                  action.payload.portRef.current.getBoundingClientRect().width /
                    2
                } ${
                  action.payload.portRef.current.getBoundingClientRect().y +
                  action.payload.portRef.current.getBoundingClientRect()
                    .height /
                    2
                }`,
              }
            );
          } else return stream;
        }) as StreamProps[],
        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.nodeId) {
            return {
              ...node,
              ports: node.ports.map((port) => {
                if (port.id === action.payload.id) {
                  return {
                    ...port,
                    status: state.streams.find(
                      (stream) => stream.status === streamStatus.active
                    )
                      ? portStatus.linked
                      : portStatus.inactive,
                    linkedNodeId: state.streams.find(
                      (stream) => stream.status === streamStatus.active
                    )?.fromNodeId,
                    linkedPortId: state.streams.find(
                      (stream) => stream.status === streamStatus.active
                    )?.fromId,
                  };
                } else return port;
              }),
            };
          } else return node;
        }) as NodeProps[],
      };
    }

    default:
      throw Error("Unknown action: " + action.type);
  }
}
