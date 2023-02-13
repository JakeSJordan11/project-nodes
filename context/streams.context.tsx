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

type StreamsAction =
  | {
      type: "CANVAS_POINTER_MOVE";
      payload: {
        clientX: number;
        clientY: number;
      };
    }
  | { type: "CANVAS_POINTER_UP"; payload: { ports: PortData[] } }
  | {
      type: "PORT_POINTER_DOWN";
      payload: {
        id: string;
        boundsX: number;
        boundsY: number;
        currentTarget: HTMLButtonElement;
        ports: PortData[];
      };
    }
  | {
      type: "PORT_POINTER_ENTER";
      payload: {
        currentTarget: HTMLButtonElement;
        id: string;
        ports: PortData[];
      };
    }
  | { type: "PORT_POINTER_LEAVE" }
  | {
      type: "PORT_DOUBLE_CLICK";
      payload: { id: string };
    };
function streamsReducer(streams: StreamData[], action: StreamsAction) {
  const STREAM_ALIGNMENT = 8;
  switch (action.type) {
    case "CANVAS_POINTER_MOVE": {
      return [
        ...streams.map((stream) => {
          const streamSourceBounds = stream.source?.getBoundingClientRect();
          const streamTargetBounds = stream.target?.getBoundingClientRect();
          if (stream.isLinked && streamSourceBounds && streamTargetBounds) {
            return {
              ...stream,
              d: `M ${streamSourceBounds.x + STREAM_ALIGNMENT} ${
                streamSourceBounds.y + STREAM_ALIGNMENT
              } L ${streamTargetBounds.x + STREAM_ALIGNMENT} ${
                streamTargetBounds.y + STREAM_ALIGNMENT
              }`,
            };
          } else if (streamSourceBounds) {
            return {
              ...stream,
              d: `M ${streamSourceBounds.x + STREAM_ALIGNMENT} ${
                streamSourceBounds.y + STREAM_ALIGNMENT
              } L ${action.payload.clientX} ${action.payload.clientY}`,
            };
          } else return { ...stream };
        }),
      ];
    }
    case "CANVAS_POINTER_UP": {
      return streams
        .filter((stream) => stream.isReadyToLink || stream.isLinked)
        .map((stream) => {
          const streamSourceBounds = stream.source?.getBoundingClientRect();
          const streamTargetBounds = stream.target?.getBoundingClientRect();
          if (
            stream.isReadyToLink &&
            streamSourceBounds &&
            streamTargetBounds
          ) {
            return {
              ...stream,
              d: `M ${streamSourceBounds.x + STREAM_ALIGNMENT} ${
                streamSourceBounds.y + STREAM_ALIGNMENT
              }  ${streamTargetBounds.x + STREAM_ALIGNMENT} ${
                streamTargetBounds.y + STREAM_ALIGNMENT
              }`,
              isLinked: true,
              isActive: false,
              isReadyToLink: false,
              stroke: "teal",
            };
          } else return stream;
        });
    }
    case "PORT_POINTER_DOWN": {
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
            source: action.payload.currentTarget as HTMLButtonElement,
            target: null,
            d: `M ${action.payload.boundsX + STREAM_ALIGNMENT} ${
              action.payload.boundsY + STREAM_ALIGNMENT
            }`,
            stroke: "blue",
          },
        ];
      } else return streams;
    }
    case "PORT_POINTER_ENTER": {
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
          return { ...stream, stroke: "darkred" };
        } else
          return {
            ...stream,
            isReadyToLink: true,
            target: action.payload.currentTarget as HTMLButtonElement,
            stroke: "teal",
          };
      });
    }
    case "PORT_POINTER_LEAVE": {
      return streams.map((stream) => {
        if (!stream.isActive) {
          return stream;
        } else
          return {
            ...stream,
            isReadyToLink: false,
            stroke: "blue",
          };
      });
    }
    case "PORT_DOUBLE_CLICK": {
      return streams.map((stream) => {
        if (
          stream.source?.id === action.payload.id ||
          stream.target?.id === action.payload.id
        ) {
          return {
            ...stream,
            source: null,
            target: null,
            isLinked: false,
          };
        } else return stream;
      });
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
}
