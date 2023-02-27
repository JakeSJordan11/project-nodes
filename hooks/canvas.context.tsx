import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { createContext, useContext, useReducer } from "react";
import type { NodeProps, StreamProps } from "../components";

export const CanvasContext = createContext({
  nodes: {} as NodeProps[],
  streams: {} as StreamProps[],
});
export const CanvasDispatchContext = createContext<Dispatch<Action>>(
  () => null
);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, {
    nodes: [],
    streams: [],
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

export enum ActionType {
  NODE_POINTER_DOWN = "NODE_POINTER_DOWN",
  CANVAS_POINTER_MOVE = "CANVAS_POINTER_MOVE",
  CANVAS_POINTER_UP = "CANVAS_POINTER_UP",
  CANVAS_POINTER_LEAVE = "CANVAS_POINTER_LEAVE",
  PORT_POINTER_DOWN = "PORT_POINTER_DOWN",
  PORT_POINTER_ENTER = "PORT_POINTER_ENTER",
  PORT_POINTER_LEAVE = "PORT_POINTER_LEAVE",
  PORT_DOUBLE_CLICK = "PORT_DOUBLE_CLICK",
  CREATE_NUMBER_NODE = "CREATE_NUMBER_NODE",
  CREATE_OPERATOR_NODE = "CREATE_OPERATOR_NODE",
  CHANGE_NUMBER_VALUE = "CHANGE_NUMBER_VALUE",
  REMOVE_NODE = "REMOVE_NODE",
}

type Action =
  | { type: ActionType.NODE_POINTER_DOWN; payload: PointerEvent<HTMLElement> }
  | { type: ActionType.CANVAS_POINTER_MOVE; payload: PointerEvent<HTMLElement> }
  | { type: ActionType.CANVAS_POINTER_UP; payload: PointerEvent<HTMLElement> }
  | {
      type: ActionType.CANVAS_POINTER_LEAVE;
      payload: PointerEvent<HTMLElement>;
    }
  | { type: ActionType.PORT_POINTER_DOWN; payload: PointerEvent<HTMLElement> }
  | { type: ActionType.PORT_POINTER_ENTER; payload: PointerEvent<HTMLElement> }
  | { type: ActionType.PORT_POINTER_LEAVE; payload: PointerEvent<HTMLElement> }
  | { type: ActionType.PORT_DOUBLE_CLICK; payload: MouseEvent<HTMLElement> }
  | {
      type: ActionType.CREATE_NUMBER_NODE;
      payload: MouseEvent<HTMLButtonElement>;
    }
  | {
      type: ActionType.CREATE_OPERATOR_NODE;
      payload: MouseEvent<HTMLButtonElement>;
    }
  | {
      type: ActionType.CHANGE_NUMBER_VALUE;
      payload: ChangeEvent<HTMLInputElement>;
    }
  | {
      type: ActionType.REMOVE_NODE;
      payload: MouseEvent<HTMLButtonElement>;
    };

function canvasReducer(
  state: { nodes: NodeProps[]; streams: StreamProps[] },
  action: Action
) {
  const STREAM_ALIGNMENT = 9;
  switch (action.type) {
    case "NODE_POINTER_DOWN": {
      const { payload } = action;
      const nodeBounds = payload.currentTarget.getBoundingClientRect();
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === payload.currentTarget.id) {
            return {
              ...node,
              isActive: true,
              offset: {
                x: payload.clientX - nodeBounds.x,
                y: payload.clientY - nodeBounds.y,
              },
            };
          } else return node;
        }),
      };
    }
    case "CANVAS_POINTER_MOVE": {
      const { payload } = action;
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.isActive) {
            return {
              ...node,
              position: {
                x: payload.clientX - node.offset.x,
                y: payload.clientY - node.offset.y,
              },
            };
          } else return node;
        }),
        streams: state.streams.map((stream) => {
          if (stream.isLinked) {
            return {
              ...stream,
              d: `M ${
                stream.source &&
                stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.source &&
                stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT
              } L ${
                stream.target &&
                stream.target.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.target &&
                stream.target.getBoundingClientRect().y + STREAM_ALIGNMENT
              }`,
            };
          } else if (stream.isActive) {
            return {
              ...stream,
              d: `M ${
                stream.source &&
                stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${
                stream.source &&
                stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT
              } L ${payload.clientX} ${payload.clientY}`,
            };
          } else return stream;
        }),
      };
    }
    case "CANVAS_POINTER_UP": {
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
        streams: state.streams.map((stream) => {
          return {
            ...stream,
            d: `M ${
              stream.source &&
              stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
            } ${
              stream.source &&
              stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT
            } L ${
              stream.target &&
              stream.target.getBoundingClientRect().x + STREAM_ALIGNMENT
            } ${
              stream.target &&
              stream.target.getBoundingClientRect().y + STREAM_ALIGNMENT
            }`,
            isActive: false,
            stroke: "#525252",
          };
        }),
      };
    }
    case "CANVAS_POINTER_LEAVE": {
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
    }
    case "PORT_POINTER_DOWN": {
      const { payload } = action;
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === payload.currentTarget.id) {
            return {
              ...node,
              outputs: node.outputs.map((output) => {
                if (output.id === payload.currentTarget.id) {
                  return {
                    ...output,
                    value: node.value,
                  };
                }
                return output;
              }),
            };
          } else return node;
        }),

        streams: [
          ...state.streams,
          {
            id: crypto.randomUUID(),
            isActive: true,
            source: payload.currentTarget,
            d: `M ${
              payload.currentTarget.getBoundingClientRect().x + STREAM_ALIGNMENT
            } ${
              payload.currentTarget.getBoundingClientRect().y + STREAM_ALIGNMENT
            }`,
            stroke: "#737373",
          },
        ],
      };
    }
    case "PORT_POINTER_ENTER": {
      const { payload } = action;

      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (stream.isActive) {
            return {
              ...stream,
              isLinked: true,
              target: payload.currentTarget,
              stroke: "#737373",
            };
          } else return stream;
        }),
      };
    }
    case "PORT_POINTER_LEAVE": {
      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (stream.isActive) {
            return {
              ...stream,
              isLinked: false,
              target: null,
              stroke: "#737373",
            };
          } else return stream;
        }),
      };
    }
    case "PORT_DOUBLE_CLICK": {
      const { payload } = action;
      return {
        ...state,
        streams: state.streams
          .map((stream) => {
            if (
              stream.source?.id === payload.currentTarget.id ||
              stream.target?.id === payload.currentTarget.id
            ) {
              return {
                ...stream,
                isLinked: false,
                source: null,
                target: null,
              };
            } else return stream;
          })
          .filter((stream) => stream.isLinked),
      };
    }
    case "CREATE_NUMBER_NODE": {
      const { payload } = action;
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            value: 0,
            position: {
              x: payload.clientX,
              y: payload.clientY,
            },
            type: "number",
            title: "Number",
            inputs: [],
            outputs: [
              {
                id: crypto.randomUUID(),
                value: 0,
              },
            ],
          },
        ],
      };
    }
    case "CREATE_OPERATOR_NODE": {
      const { payload } = action;

      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            position: { x: payload.clientX, y: payload.clientY },
            type: "operator",
            title: "Operator",
            inputs: [
              {
                id: crypto.randomUUID(),
                value: 0,
              },
              {
                id: crypto.randomUUID(),
                value: 0,
              },
            ],
            outputs: [],
          },
        ],
      };
    }
    case "CHANGE_NUMBER_VALUE": {
      const { payload } = action;
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === payload.currentTarget.parentElement?.id) {
            return {
              ...node,
              value: payload.currentTarget.value,
            };
          } else return node;
        }),
      };
    }
    case "REMOVE_NODE": {
      const { payload } = action;
      return {
        ...state,
        nodes: state.nodes.filter(
          (node) => node.id !== payload.currentTarget.id
        ),
      };
    }
    default:
      throw new Error("Unhandled action type " + action.type);
  }
}
