import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import type { NodeData } from "../components";
import { initialNodes } from "../components";

export const NodesContext = createContext<NodeData[]>([]);
export const NodesDispatchContext = createContext<Dispatch<Action>>(() => null);

export function NodesProvider({ children }: { children: ReactNode }) {
  const [nodes, dispatch] = useReducer(nodesReducer, initialNodes);
  return (
    <NodesContext.Provider value={nodes}>
      <NodesDispatchContext.Provider value={dispatch}>
        {children}
      </NodesDispatchContext.Provider>
    </NodesContext.Provider>
  );
}

export function useNodes() {
  return useContext(NodesContext);
}

export function useNodesDispatch() {
  return useContext(NodesDispatchContext);
}

type Action =
  | {
      type: "CANVAS_POINTER_MOVE";
      payload: { clientX: number; clientY: number };
    }
  | { type: "NODE_POINTER_UP" }
  | {
      type: "NODE_POINTER_DOWN";
      payload: {
        id: string;
        clientX: number;
        clientY: number;
        boundsX: number;
        boundsY: number;
      };
    };
function nodesReducer(nodes: NodeData[], action: Action) {
  switch (action.type) {
    case "NODE_POINTER_DOWN": {
      return nodes.map((node) => {
        if (node.id === action.payload.id) {
          return {
            ...node,
            isActive: true,
            offset: {
              x: action.payload.clientX - action.payload.boundsX,
              y: action.payload.clientY - action.payload.boundsY,
            },
          };
        } else return node;
      });
    }
    case "CANVAS_POINTER_MOVE": {
      return nodes.map((node) => {
        if (node.isActive) {
          return {
            ...node,
            position: {
              x: action.payload.clientX - node.offset.x,
              y: action.payload.clientY - node.offset.y,
            },
          };
        }
        return { ...node };
      });
    }
    case "NODE_POINTER_UP": {
      return nodes.map((node) => {
        if (!node) {
          return node;
        }
        return {
          ...node,
          isActive: false,
        };
      });
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
    }
  }
}
