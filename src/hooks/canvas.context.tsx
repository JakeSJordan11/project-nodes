import { canvasReducer } from "@/hooks/canvas.reducer";
import type { CanvasAction, CanvasState } from "@/types/canvas.reducer.types";
import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";

const initialState: CanvasState = {
  nodes: [],
  streams: [],
};

export const CanvasContext = createContext<CanvasState>(initialState);

export const CanvasDispatchContext = createContext<Dispatch<CanvasAction>>(
  () => null
);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
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
