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

export enum PortsActionType {
  StreamPointerUp = "STREAM_POINTER_UP",
  PortDoubleClick = "PORT_DOUBLE_CLICK",
}
type PortsAction =
  | {
      type: PortsActionType.StreamPointerUp;
      payload: { streams: StreamData[] };
    }
  | {
      type: PortsActionType.PortDoubleClick;
      payload: { id: string; streams: StreamData[] };
    };
function portsReducer(ports: PortData[], action: PortsAction) {
  switch (action.type) {
    case PortsActionType.StreamPointerUp: {
      action.payload.streams.map((stream) => {
        if (stream.isReadyToLink) {
          return ports.map((port) => {
            if (
              port.id === stream.source?.id ||
              port.id === stream.target?.id
            ) {
              return { ...port, isLinked: true };
            }
          });
        }
      });
    }
    case PortsActionType.PortDoubleClick: {
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
