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

export enum NodesActionType {
  NodePointerDown = "NODE_POINTER_DOWN",
  NodePointerMove = "NODE_POINTER_MOVE",
  NodePointerUp = "NODE_POINTER_UP",
}
type Action =
  | {
      type: NodesActionType.NodePointerMove;
      payload: { clientX: number; clientY: number };
    }
  | { type: NodesActionType.NodePointerUp }
  | {
      type: NodesActionType.NodePointerDown;
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
    case NodesActionType.NodePointerDown: {
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
    case NodesActionType.NodePointerMove: {
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
    case NodesActionType.NodePointerUp: {
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
