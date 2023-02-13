import type { Dispatch, MouseEvent, PointerEvent, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import { initialNodes, initialPorts, initialStreams } from "../data";
import type { NodeData, PortData, StreamData } from "../types";

export const CanvasContext = createContext({
  nodes: [] as NodeData[],
  ports: [] as PortData[],
  streams: [] as StreamData[],
});
export const CanvasDispatchContext = createContext<Dispatch<Action>>(
  () => null
);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(nodesReducer, {
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
  | { type: "CANVAS_POINTER_UP" }
  | { type: "CANVAS_POINTER_MOVE"; payload: PointerEvent }
  | { type: "NODE_POINTER_DOWN"; payload: PointerEvent }
  | { type: "NODE_POINTER_UP" }
  | { type: "PORT_POINTER_DOWN"; payload: PointerEvent }
  | { type: "PORT_POINTER_ENTER"; payload: PointerEvent }
  | { type: "PORT_POINTER_LEAVE" }
  | { type: "PORT_DOUBLE_CLICK"; payload: MouseEvent };

function nodesReducer(
  state: { nodes: NodeData[]; ports: PortData[]; streams: StreamData[] },
  action: Action
) {
  switch (action.type) {
    case "CANVAS_POINTER_UP": {
      return {
        ...state,
      };
    }
    case "CANVAS_POINTER_MOVE": {
      return {
        ...state,
      };
    }
    case "NODE_POINTER_DOWN": {
      return {
        ...state,
      };
    }
    case "NODE_POINTER_UP": {
      return {
        ...state,
      };
    }
    case "PORT_POINTER_DOWN": {
      return {
        ...state,
      };
    }
    case "PORT_POINTER_ENTER": {
      return {
        ...state,
      };
    }
    case "PORT_POINTER_LEAVE": {
      return {
        ...state,
      };
    }
    case "PORT_DOUBLE_CLICK": {
      return {
        ...state,
      };
    }

    default:
      throw new Error("Unhandled action type");
  }
}
