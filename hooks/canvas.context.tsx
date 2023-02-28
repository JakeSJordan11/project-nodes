import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { createContext, useContext, useReducer } from "react";
import type { NodeProps, StreamProps } from "../components";

export type CanvasState = {
  nodes: NodeProps[];
  streams: StreamProps[];
};
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

export enum CanvasActionType {
  SELECT_NODE = "SELECT_NODE",
  CREATE_NUMBER_NODE = "CREATE_NUMBER_NODE",
  CREATE_OPERATOR_NODE = "CREATE_OPERATOR_NODE",
  CHANGE_VALUE_SLIDER = "CHANGE_VALUE_SLIDER",
  MOVE_NODE = "MOVE_NODE",
  DROP_NODE = "DROP_NODE",
}

type SelectNode = {
  type: CanvasActionType.SELECT_NODE;
  payload: PointerEvent<HTMLElement>;
};

type CreateNumberNode = {
  type: CanvasActionType.CREATE_NUMBER_NODE;
  payload: MouseEvent<HTMLButtonElement>;
};

type CreateOperatorNode = {
  type: CanvasActionType.CREATE_OPERATOR_NODE;
  payload: MouseEvent<HTMLButtonElement>;
};

type ChangeNumberNodeValue = {
  type: CanvasActionType.CHANGE_VALUE_SLIDER;
  payload: ChangeEvent<HTMLInputElement>;
};

type MoveNode = {
  type: CanvasActionType.MOVE_NODE;
  payload: PointerEvent<HTMLElement>;
};

type DropNode = {
  type: CanvasActionType.DROP_NODE;
  payload: PointerEvent<HTMLElement>;
};

export type CanvasAction =
  | SelectNode
  | CreateNumberNode
  | CreateOperatorNode
  | ChangeNumberNodeValue
  | MoveNode
  | DropNode;

export function canvasReducer(state: CanvasState, action: CanvasAction) {
  switch (action.type) {
    case "SELECT_NODE":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.currentTarget.id) {
            return {
              ...node,
              isActive: true,
              offset: {
                x:
                  action.payload.clientX -
                  action.payload.currentTarget.getBoundingClientRect().x,
                y:
                  action.payload.clientY -
                  action.payload.currentTarget.getBoundingClientRect().y,
              },
            };
          } else return { ...node, isActive: false };
        }),
      };
    case "CREATE_NUMBER_NODE":
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            title: "Number",
            type: "number",
            value: 0,
            position: {
              x: action.payload.clientX - 65,
              y: action.payload.clientY - 25,
            },
            inputs: [],
            outputs: [{ id: crypto.randomUUID() }],
          },
        ] as NodeProps[],
      };
    case "CREATE_OPERATOR_NODE":
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            title: "Operator",
            type: "operator",
            position: {
              x: action.payload.clientX - 65,
              y: action.payload.clientY - 25,
            },
            inputs: [{ id: crypto.randomUUID() }, { id: crypto.randomUUID() }],
            outputs: [],
          },
        ] as NodeProps[],
      };
    case "CHANGE_VALUE_SLIDER":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.currentTarget.parentElement?.id) {
            return {
              ...node,
              value: parseInt(action.payload.currentTarget.value),
            };
          } else return node;
        }),
      };
    case "MOVE_NODE":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.isActive) {
            return {
              ...node,
              position: {
                x: action.payload.clientX - node.offset.x,
                y: action.payload.clientY - node.offset.y,
              },
            };
          } else return node;
        }),
      };
    case "DROP_NODE":
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

    default:
      throw Error("Unknown action: " + action.type);
  }
}
