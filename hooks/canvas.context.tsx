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
  DRAG_SELECTION = "DRAG_SELECTION",
  DROP_SELECTION = "DROP_SELECTION",
  CREATE_STREAM = "CREATE_STREAM",
  LINK_STREAM = "LINK_STREAM",
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

type DragSelection = {
  type: CanvasActionType.DRAG_SELECTION;
  payload: PointerEvent<HTMLElement>;
};

type DropSelection = { type: CanvasActionType.DROP_SELECTION };

type CreateStream = {
  type: CanvasActionType.CREATE_STREAM;
  payload: PointerEvent<HTMLButtonElement>;
};

type LinkStream = {
  type: CanvasActionType.LINK_STREAM;
  payload: PointerEvent<HTMLButtonElement>;
};

export type CanvasAction =
  | SelectNode
  | CreateNumberNode
  | CreateOperatorNode
  | ChangeNumberNodeValue
  | DragSelection
  | DropSelection
  | CreateStream
  | LinkStream;

export function canvasReducer(state: CanvasState, action: CanvasAction) {
  const STREAM_ALIGNMENT = 10;
  const CENTER_NODE_X = 65;
  const CENTER_NODE_Y = 25;

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
          } else return node;
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
              x: action.payload.clientX - CENTER_NODE_X,
              y: action.payload.clientY - CENTER_NODE_Y,
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
        streams: state.streams.map((stream) => {
          if (
            (stream.isLinked &&
              stream.target.parentElement?.parentElement?.id ===
                action.payload.currentTarget.parentElement?.id) ||
            stream.source.parentElement?.parentElement?.id ===
              action.payload.currentTarget.parentElement?.id
          ) {
            return {
              ...stream,
              value: action.payload.currentTarget.value,
            };
          } else return stream;
        }) as StreamProps[],
      };

    case "DRAG_SELECTION":
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
        streams: state.streams.map((stream) => {
          if (stream.isActive) {
            return {
              ...stream,
              l: `L${action.payload.clientX} ${action.payload.clientY}`,
            };
          } else if (stream.isLinked) {
            return {
              ...stream,
              m: `M${
                stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT}`,
              l: `L${
                stream.target.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${stream.target.getBoundingClientRect().y + STREAM_ALIGNMENT}`,
            };
          } else return stream;
        }) as StreamProps[],
      };

    case "DROP_SELECTION":
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
        streams: state.streams.filter((stream) => stream.isLinked),
      };

    case "CREATE_STREAM":
      return {
        ...state,
        streams: [
          ...state.streams,
          {
            id: crypto.randomUUID(),
            isActive: true,
            stroke: "red",
            source: action.payload.currentTarget,
            m: `M${
              action.payload.currentTarget.getBoundingClientRect().x +
              STREAM_ALIGNMENT
            } ${
              action.payload.currentTarget.getBoundingClientRect().y +
              STREAM_ALIGNMENT
            }`,
            value: state.nodes.find(
              (node) =>
                node.id ===
                action.payload.currentTarget.parentElement?.parentElement?.id
            )?.value,
          },
        ] as StreamProps[],
      };

    case "LINK_STREAM":
      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (
            stream.isActive &&
            stream.source !== action.payload.currentTarget
          ) {
            return {
              ...stream,
              isActive: false,
              isLinked: true,
              target: action.payload.currentTarget,
              stroke: "blue",
              l: `L${
                action.payload.currentTarget.getBoundingClientRect().x +
                STREAM_ALIGNMENT
              } ${
                action.payload.currentTarget.getBoundingClientRect().y +
                STREAM_ALIGNMENT
              }`,
            };
          } else if (stream.value) {
            console.log("ass");
            return {
              ...stream,
              value: action.payload.currentTarget.value,
            };
          } else return stream;
        }) as StreamProps[],
      };

    default:
      throw Error("Unknown action: " + action.type);
  }
}
