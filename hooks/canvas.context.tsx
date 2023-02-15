import type { Dispatch, MouseEvent, PointerEvent, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import { initialNodes, initialPorts, initialStreams } from "../data";
import type { NodeData, PortData, StreamData } from "../types";

export const CanvasContext = createContext({
  nodes: {} as NodeData[],
  ports: {} as PortData[],
  streams: {} as StreamData[],
});
export const CanvasDispatchContext = createContext<Dispatch<Action>>(
  () => null
);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, {
    nodes: initialNodes,
    ports: initialPorts,
    streams: initialStreams,
  });
  return (
    <CanvasContext.Provider value={state}>
      <CanvasDispatchContext.Provider value={dispatch}>
        {children}
      </CanvasDispatchContext.Provider>
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  return useContext(CanvasContext);
}

export function useCanvasDispatch() {
  return useContext(CanvasDispatchContext);
}

type Action =
  | { type: "NODE_POINTER_DOWN"; payload: PointerEvent<HTMLElement> }
  | { type: "CANVAS_POINTER_MOVE"; payload: PointerEvent<HTMLElement> }
  | { type: "CANVAS_POINTER_UP"; payload: PointerEvent<HTMLElement> }
  | { type: "CANVAS_POINTER_LEAVE"; payload: PointerEvent<HTMLElement> }
  | { type: "PORT_POINTER_DOWN"; payload: PointerEvent<HTMLElement> }
  | { type: "PORT_POINTER_ENTER"; payload: PointerEvent<HTMLElement> }
  | { type: "PORT_POINTER_LEAVE"; payload: PointerEvent<HTMLElement> }
  | { type: "PORT_DOUBLE_CLICK"; payload: MouseEvent<HTMLElement> };

function canvasReducer(
  state: { nodes: NodeData[]; ports: PortData[]; streams: StreamData[] },
  action: Action
) {
  const STREAM_ALIGNMENT = 8;
  const { payload } = action;
  switch (action.type) {
    case "NODE_POINTER_DOWN": {
      const nodeBounds = payload.currentTarget.getBoundingClientRect();
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === payload.currentTarget.id) {
            return {
              ...node,
              isActive: true,
              offset: {
                x: payload.clientX - nodeBounds.x,
                y: payload.clientY - nodeBounds.y,
              },
            };
          } else return node;
        }),
      };
    }
    case "CANVAS_POINTER_MOVE": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.isActive) {
            return {
              ...node,
              position: {
                x: payload.clientX - node.offset.x,
                y: payload.clientY - node.offset.y,
              },
            };
          } else return node;
        }),
        streams: state.streams.map((stream) => {
          if (stream.isLinked) {
            return {
              ...stream,
              d: `M ${
                stream.source &&
                stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.source &&
                stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT
              } L ${
                stream.target &&
                stream.target.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.target &&
                stream.target.getBoundingClientRect().y + STREAM_ALIGNMENT
              }`,
            };
          } else if (stream.isActive) {
            return {
              ...stream,
              d: `M ${
                stream.source &&
                stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.source &&
                stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT
              } L ${payload.clientX} ${payload.clientY}`,
            };
          } else return stream;
        }),
      };
    }
    case "CANVAS_POINTER_UP": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.isActive) {
            return {
              ...node,
              isActive: false,
            };
          } else return node;
        }),
        streams: state.streams
          .map((stream) => {
            return {
              ...stream,
              d: `M ${
                stream.source &&
                stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.source &&
                stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT
              } L ${
                stream.target &&
                stream.target.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.target &&
                stream.target.getBoundingClientRect().y + STREAM_ALIGNMENT
              }`,
              isActive: false,
              stroke: "teal",
            };
          })
          .filter((stream) => stream.isLinked),
        ports: state.ports.map((port) => {
          if (
            state.streams
              .map((stream) => stream.isLinked && stream.target?.id)
              .includes(port.id) ||
            state.streams
              .map((stream) => stream.isLinked && stream.source?.id)
              .includes(port.id)
          ) {
            return {
              ...port,
              isLinked: true,
            };
          } else return port;
        }),
      };
    }
    case "CANVAS_POINTER_LEAVE": {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.isActive) {
            return {
              ...node,
              isActive: false,
            };
          } else return node;
        }),
      };
    }
    case "PORT_POINTER_DOWN": {
      const activePort = state.ports.find(
        (port) => port.id === payload.currentTarget.id
      );

      return {
        ...state,
        streams: [
          ...state.streams,
          {
            id: crypto.randomUUID(),
            isActive: activePort?.isLinked ? false : true,
            source: payload.currentTarget as HTMLButtonElement,
            d: `M ${
              payload.currentTarget.getBoundingClientRect().x + STREAM_ALIGNMENT
            }
                ${
                  payload.currentTarget.getBoundingClientRect().y +
                  STREAM_ALIGNMENT
                }`,
            stroke: "blue",
          },
        ] as StreamData[],
      };
    }
    case "PORT_POINTER_ENTER": {
      const targetPort = state.ports.find(
        (port) => port.id === payload.currentTarget.id
      );
      const sourcePort = state.ports.find(
        (port) =>
          port.id ===
          state.streams.find((stream) => stream.isActive)?.source?.id
      );
      const portTypesMatch = sourcePort?.type === targetPort?.type;
      const portParentsMatch = sourcePort?.parentId === targetPort?.parentId;
      const portIsLinked = targetPort?.isLinked;
      const streamErrors = portTypesMatch || portParentsMatch || portIsLinked;

      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (stream.isActive) {
            return {
              ...stream,
              isLinked: !streamErrors,
              target: payload.currentTarget as HTMLButtonElement,
              stroke: streamErrors ? "darkred" : "teal",
            };
          } else return stream;
        }),
      };
    }
    case "PORT_POINTER_LEAVE": {
      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (stream.isActive) {
            return {
              ...stream,
              isLinked: false,
              target: null,
              stroke: "blue",
            };
          } else return stream;
        }),
      };
    }
    case "PORT_DOUBLE_CLICK": {
      return {
        ...state,
        streams: state.streams
          .map((stream) => {
            if (
              stream.source?.id === payload.currentTarget.id ||
              stream.target?.id === payload.currentTarget.id
            ) {
              return {
                ...stream,
                isLinked: false,
                source: null,
                target: null,
              };
            } else return stream;
          })
          .filter((stream) => stream.isLinked),
        ports: state.ports.map((port) => {
          if (
            state.streams
              .map((stream) => stream.isLinked && stream.target?.id)
              .includes(port.id) ||
            state.streams
              .map((stream) => stream.isLinked && stream.source?.id)
              .includes(port.id)
          ) {
            return {
              ...port,
              isLinked: false,
            };
          } else return port;
        }),
      };
    }
    default:
      throw new Error("Unhandled action type");
  }
}
