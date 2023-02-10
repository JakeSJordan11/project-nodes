import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import type { PortData, StreamData } from "../components";
import { initialStreams } from "../components";

export const StreamsContext = createContext<StreamData[]>([]);
export const StreamsDispatchContext = createContext<Dispatch<StreamsAction>>(
  () => null
);

export function StreamsProvider({ children }: { children: ReactNode }) {
  const [streams, dispatch] = useReducer(streamsReducer, initialStreams);
  return (
    <StreamsContext.Provider value={streams}>
      <StreamsDispatchContext.Provider value={dispatch}>
        {children}
      </StreamsDispatchContext.Provider>
    </StreamsContext.Provider>
  );
}

export function useStreams() {
  return useContext(StreamsContext);
}

export function useStreamsDispatch() {
  return useContext(StreamsDispatchContext);
}

export enum StreamsActionType {
  NodePointerMove = "NODE_POINTER_MOVE",
  StreamPointerUp = "STREAM_POINTER_UP",
  PortPointerDown = "PORT_POINTER_DOWN",
  PortPointerEnter = "PORT_POINTER_ENTER",
  PortPointerLeave = "PORT_POINTER_LEAVE",
  PortDoubleClick = "PORT_DOUBLE_CLICK",
}
type StreamsAction =
  | {
      type: StreamsActionType.NodePointerMove;
      payload: {
        clientX: number;
        clientY: number;
      };
    }
  | { type: StreamsActionType.StreamPointerUp }
  | {
      type: StreamsActionType.PortPointerDown;
      payload: {
        id: string;
        boundsX: number;
        boundsY: number;
        currentTarget: HTMLButtonElement;
        ports: PortData[];
      };
    }
  | {
      type: StreamsActionType.PortPointerEnter;
      payload: {
        currentTarget: HTMLButtonElement;
        id: string;
        ports: PortData[];
      };
    }
  | { type: StreamsActionType.PortPointerLeave }
  | {
      type: StreamsActionType.PortDoubleClick;
      payload: { id: string };
    };
function streamsReducer(streams: StreamData[], action: StreamsAction) {
  const STREAM_ALIGNMENT = 8;
  switch (action.type) {
    case StreamsActionType.NodePointerMove: {
      return [
        ...streams.map((stream) => {
          const streamSourceBounds = stream.source?.getBoundingClientRect();
          const streamTargetBounds = stream.target?.getBoundingClientRect();
          if (stream.isLinked) {
            return {
              ...stream,
              d: `M ${
                streamSourceBounds && streamSourceBounds.x + STREAM_ALIGNMENT
              }
              ${streamSourceBounds && streamSourceBounds.y + STREAM_ALIGNMENT}
              L ${streamTargetBounds && streamTargetBounds.x + STREAM_ALIGNMENT}
              ${streamTargetBounds && streamTargetBounds.y + STREAM_ALIGNMENT}`,
            };
          }
          return {
            ...stream,
            d: `M ${
              streamSourceBounds && streamSourceBounds.x + STREAM_ALIGNMENT
            }
            ${streamSourceBounds && streamSourceBounds.y + STREAM_ALIGNMENT}
            L ${action.payload.clientX} ${action.payload.clientY}`,
          };
        }),
      ];
    }
    case StreamsActionType.StreamPointerUp: {
      return (
        streams.map((stream) => {
          const streamSourceBounds = stream.source?.getBoundingClientRect();
          const streamTargetBounds = stream.target?.getBoundingClientRect();
          if (stream.isReadyToLink) {
            return {
              ...stream,
              d: `M ${
                streamSourceBounds && streamSourceBounds.x + STREAM_ALIGNMENT
              } 
                ${streamSourceBounds && streamSourceBounds.y + STREAM_ALIGNMENT}
                L ${
                  streamTargetBounds && streamTargetBounds.x + STREAM_ALIGNMENT
                }
                ${
                  streamTargetBounds && streamTargetBounds.y + STREAM_ALIGNMENT
                }`,
              isLinked: true,
              isActive: false,
              isReadyToLink: false,
              stroke: "teal",
            };
          } else if (!stream.isActive) {
            return { ...stream, isActive: false, isReadyToLink: false };
          }
          return {
            ...stream,
            isActive: false,
            isReadyToLink: false,
          };
        }),
        streams.filter((stream) => stream.isLinked)
      );
    }
    case StreamsActionType.PortPointerDown: {
      const port = action.payload.ports.find(
        (port) => port.id === action.payload.id
      );

      if (!port?.isLinked) {
        return [
          ...streams,
          {
            id: crypto.randomUUID(),
            isActive: true,
            isLinked: false,
            isReadyToLink: false,
            source: action.payload.currentTarget,
            target: null,
            d: `M ${action.payload.boundsX + STREAM_ALIGNMENT} ${
              action.payload.boundsY + STREAM_ALIGNMENT
            }`,
            stroke: "blue",
          },
        ];
      }
    }
    case StreamsActionType.PortPointerEnter: {
      const targetPort = action.payload.ports.find(
        (port) => port.id === action.payload.id
      );
      const sourcePort = action.payload.ports.find(
        (port) =>
          port.id === streams.find((stream) => stream.isActive)?.source?.id
      );
      const portTypesMatch = sourcePort?.type === targetPort?.type;
      const portParentsMatch = sourcePort?.parentId === targetPort?.parentId;
      const portIsLinked = targetPort?.isLinked;
      const streamErrors = portTypesMatch || portParentsMatch || portIsLinked;

      return streams.map((stream) => {
        if (!stream.isActive) {
          return stream;
        } else if (streamErrors) {
          stream.stroke = "darkred";
        } else {
          stream.isReadyToLink = true;
          stream.target = action.payload.currentTarget;
          stream.stroke = "teal";
        }
        return stream;
      });
    }
    case StreamsActionType.PortPointerLeave: {
      return streams.map((stream) => {
        if (!stream.isActive) {
          return stream;
        } else {
          stream.isReadyToLink = false;
          stream.stroke = "blue";
        }
        return stream;
      });
    }
    case StreamsActionType.PortDoubleClick: {
      return (
        streams.map((stream) => {
          if (
            stream.source?.id === action.payload.id ||
            stream.target?.id === action.payload.id
          ) {
            return {
              ...stream,
              isLinked: false,
            };
          }
        }),
        streams.filter((stream) => stream.isLinked)
      );
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
}
