import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import type { PortData, StreamData } from "../components";
import { initialPorts } from "../components";

export const PortsContext = createContext<PortData[]>([]);
export const PortsDispatchContext = createContext<Dispatch<PortsAction>>(
  () => null
);

export function PortsProvider({ children }: { children: ReactNode }) {
  const [ports, dispatch] = useReducer(portsReducer, initialPorts);
  return (
    <PortsContext.Provider value={ports}>
      <PortsDispatchContext.Provider value={dispatch}>
        {children}
      </PortsDispatchContext.Provider>
    </PortsContext.Provider>
  );
}

export function usePorts() {
  return useContext(PortsContext);
}

export function usePortsDispatch() {
  return useContext(PortsDispatchContext);
}

type PortsAction =
  | {
      type: "CANVAS_POINTER_UP";
      payload: { streams: StreamData[] };
    }
  | {
      type: "PORT_DOUBLE_CLICK";
      payload: {
        id: string;
        streams: StreamData[];
      };
    };
function portsReducer(ports: PortData[], action: PortsAction) {
  switch (action.type) {
    case "CANVAS_POINTER_UP": {
      action.payload.streams
        .filter((stream) => stream.isLinked || stream.isReadyToLink)
        .map((stream) => {
          ports.map((port) => {
            if (stream.source && port.id === stream.source.id) {
              console.log("stream", stream);
              return { ...port, isLinked: true };
            } else return port;
          });
        });
    }
    case "PORT_DOUBLE_CLICK": {
      return ports.map((port) => {
        if (port.isLinked) {
          return { ...port, isLinked: false };
        } else return port;
      });
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
}
