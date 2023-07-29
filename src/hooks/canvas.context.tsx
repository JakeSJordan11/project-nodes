import type {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from 'react'
import { createContext, useContext, useReducer } from 'react'
import type { NodeProps, StreamProps } from '../components'

export type CanvasState = {
  nodes: NodeProps[]
  streams: StreamProps[]
}
const initialState: CanvasState = {
  nodes: [],
  streams: [],
}

export const CanvasContext = createContext<CanvasState>(initialState)

export const CanvasDispatchContext = createContext<Dispatch<CanvasAction>>(
  () => null
)

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState)
  return (
    <CanvasContext.Provider value={state}>
      <CanvasDispatchContext.Provider value={dispatch}>
        {children}
      </CanvasDispatchContext.Provider>
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  return useContext(CanvasContext)
}

export function useCanvasDispatch() {
  return useContext(CanvasDispatchContext)
}

export enum CanvasActionType {
  SELECT_NODE = 'SELECT_NODE',
  CREATE_NUMBER_NODE = 'CREATE_NUMBER_NODE',
  CREATE_OPERATOR_NODE = 'CREATE_OPERATOR_NODE',
  CHANGE_VALUE_SLIDER = 'CHANGE_VALUE_SLIDER',
  DRAG_SELECTION = 'DRAG_SELECTION',
  DROP_SELECTION = 'DROP_SELECTION',
  CREATE_STREAM = 'CREATE_STREAM',
  LINK_STREAM = 'LINK_STREAM',
  UNLINK_STREAM = 'UNLINK_STREAM',
  ENTER_PORT = 'ENTER_PORT',
  LEAVE_PORT = 'LEAVE_PORT',
  LEAVE_CANVAS = 'LEAVE_CANVAS',
}

type SelectNode = {
  type: CanvasActionType.SELECT_NODE
  payload: PointerEvent<HTMLElement>
}

type CreateNumberNode = {
  type: CanvasActionType.CREATE_NUMBER_NODE
  payload: MouseEvent<HTMLButtonElement>
}

type CreateOperatorNode = {
  type: CanvasActionType.CREATE_OPERATOR_NODE
  payload: MouseEvent<HTMLButtonElement>
}

type ChangeNumberNodeValue = {
  type: CanvasActionType.CHANGE_VALUE_SLIDER
  payload: ChangeEvent<HTMLInputElement>
}

type DragSelection = {
  type: CanvasActionType.DRAG_SELECTION
  payload: PointerEvent<HTMLElement>
}

type DropSelection = {
  type: CanvasActionType.DROP_SELECTION
  payload?: PointerEvent<HTMLElement>
}

type CreateStream = {
  type: CanvasActionType.CREATE_STREAM
  payload: PointerEvent<HTMLButtonElement>
}

type LinkStream = {
  type: CanvasActionType.LINK_STREAM
  payload: PointerEvent<HTMLButtonElement>
}

type UnlinkStream = {
  type: CanvasActionType.UNLINK_STREAM
  payload: MouseEvent<HTMLButtonElement>
}

type EnterPort = {
  type: CanvasActionType.ENTER_PORT
  payload: PointerEvent<HTMLButtonElement>
}

type LeavePort = {
  type: CanvasActionType.LEAVE_PORT
  payload: PointerEvent<HTMLButtonElement>
}

type LeaveCanvas = { type: CanvasActionType.LEAVE_CANVAS }

export type CanvasAction =
  | SelectNode
  | CreateNumberNode
  | CreateOperatorNode
  | ChangeNumberNodeValue
  | DragSelection
  | DropSelection
  | CreateStream
  | LinkStream
  | EnterPort
  | LeavePort
  | LeaveCanvas
  | UnlinkStream

export function canvasReducer(state: CanvasState, action: CanvasAction) {
  const STREAM_ALIGNMENT = 10
  const CENTER_NODE_X = 65
  const CENTER_NODE_Y = 25

  switch (action.type) {
    case 'SELECT_NODE':
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
            }
          } else return node
        }),
      }

    case 'CREATE_NUMBER_NODE':
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            title: 'Number',
            type: 'number',
            isActive: false,
            value: null,
            position: {
              x: action.payload.clientX - CENTER_NODE_X,
              y: action.payload.clientY - CENTER_NODE_Y,
            },
            outputs: [
              {
                id: crypto.randomUUID(),
                value: null,
                isHovered: false,
                isLinked: false,
                type: 'output',
              },
            ],
          },
        ] as NodeProps[],
      }

    case 'CREATE_OPERATOR_NODE':
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            title: 'Operator',
            type: 'operator',
            position: {
              x: action.payload.clientX - CENTER_NODE_X,
              y: action.payload.clientY - CENTER_NODE_Y,
            },
            inputs: [
              { id: crypto.randomUUID(), value: null, type: 'input' },
              { id: crypto.randomUUID(), value: null, type: 'input' },
            ],
          },
        ] as NodeProps[],
      }

    case 'CHANGE_VALUE_SLIDER':
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id === action.payload.currentTarget.parentElement?.id) {
            return {
              ...node,
              value: parseInt(action.payload.currentTarget.value),
              outputs:
                node.outputs &&
                node.outputs.map((output) => {
                  return {
                    ...output,
                    value: parseInt(action.payload.currentTarget.value),
                  }
                }),
            }
          } else return node
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
              value: parseInt(action.payload.currentTarget.value),
            }
          } else return stream
        }),
      }

    case 'DRAG_SELECTION':
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
            }
          } else return node
        }),
        streams: state.streams.map((stream) => {
          if (stream.isActive) {
            return {
              ...stream,
              l: `L${action.payload.clientX} ${action.payload.clientY}`,
            }
          } else if (stream.isLinked) {
            return {
              ...stream,
              m: `M${
                stream.source.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${stream.source.getBoundingClientRect().y + STREAM_ALIGNMENT}`,
              l: `L${
                stream.target.getBoundingClientRect().x + STREAM_ALIGNMENT
              } ${stream.target.getBoundingClientRect().y + STREAM_ALIGNMENT}`,
            }
          } else return stream
        }),
      }

    case 'LEAVE_CANVAS':
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.isActive) {
            return {
              ...node,
              isActive: false,
              inputs:
                node.inputs &&
                node.inputs.map((input) => {
                  return {
                    ...input,
                    isLinked: false,
                  }
                }),
              outputs:
                node.outputs &&
                node.outputs.map((output) => {
                  return {
                    ...output,
                    isLinked: false,
                  }
                }),
            }
          } else return node
        }),
        streams: state.streams
          .map((stream) => {
            if (stream.isActive) {
              return {
                ...stream,
                isActive: false,
              }
            } else return stream
          })
          .filter((stream) => stream.isLinked),
      }

    case 'DROP_SELECTION': {
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          return {
            ...node,
            isActive: node.isActive ? false : node.isActive,
            inputs:
              node.inputs &&
              node.inputs.map((input) => {
                if (state.streams.find((stream) => stream.isActive)) {
                  return {
                    ...input,
                    isLinked: false,
                    isHovered: false,
                  }
                } else return input
              }),
            outputs:
              node.outputs &&
              node.outputs.map((output) => {
                if (state.streams.find((stream) => stream.isActive)) {
                  return {
                    ...output,
                    isLinked: false,
                    isHovered: false,
                  }
                } else return output
              }),
          }
        }),
        streams: state.streams
          .map((stream) => {
            if (stream.isActive) {
              return {
                ...stream,
                isActive: false,
              }
            } else return stream
          })
          .filter((stream) => stream.isLinked),
      }
    }

    case 'CREATE_STREAM':
      return {
        ...state,
        streams: [
          ...state.streams,
          {
            id: crypto.randomUUID(),
            isActive: true,
            source: action.payload.currentTarget,
            target: null,
            m: `M${
              action.payload.currentTarget.getBoundingClientRect().x +
              STREAM_ALIGNMENT
            } ${
              action.payload.currentTarget.getBoundingClientRect().y +
              STREAM_ALIGNMENT
            }`,
            l: `L${
              action.payload.currentTarget.getBoundingClientRect().x +
              STREAM_ALIGNMENT
            } ${
              action.payload.currentTarget.getBoundingClientRect().y +
              STREAM_ALIGNMENT
            }`,
            value: state.streams.find((stream) => stream.isActive)?.source
              .value,
          },
        ] as StreamProps[],
        nodes: state.nodes.map((node) => {
          if (
            node.id ===
            action.payload.currentTarget.parentElement?.parentElement?.id
          ) {
            return {
              ...node,
              outputs:
                node.outputs &&
                node.outputs.map((output) => {
                  if (
                    output.id === action.payload.currentTarget.id &&
                    !output.isLinked
                  ) {
                    return {
                      ...output,
                      value: node.value,
                      isLinked: true,
                    }
                  } else return output
                }),
              inputs:
                node.inputs &&
                node.inputs.map((input) => {
                  if (
                    input.id === action.payload.currentTarget.id &&
                    !input.isLinked
                  ) {
                    return {
                      ...input,
                      value: node.value,
                      isLinked: true,
                    }
                  } else return input
                }),
            }
          } else return node
        }),
      }

    case 'LINK_STREAM':
      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (
            stream.isActive &&
            action.payload.currentTarget.id !== stream.source.id &&
            action.payload.currentTarget.parentElement?.parentElement?.id !==
              stream.source.parentElement?.parentElement?.id
          ) {
            return {
              ...stream,
              isActive: false,
              isLinked: true,
              target: action.payload.currentTarget,
              l: `L${
                action.payload.currentTarget.getBoundingClientRect().x +
                STREAM_ALIGNMENT
              } ${
                action.payload.currentTarget.getBoundingClientRect().y +
                STREAM_ALIGNMENT
              }`,
            }
          } else return stream
        }),
        nodes: state.nodes.map((node) => {
          if (state.streams.find((stream) => stream.isActive)) {
            return {
              ...node,
              inputs:
                node.inputs &&
                node.inputs.map((input) => {
                  if (input.id === action.payload.currentTarget.id) {
                    return {
                      ...input,
                      value: input.value,
                      isLinked: true,
                    }
                  } else return input
                }),
              outputs:
                node.outputs &&
                node.outputs.map((output) => {
                  if (output.id === action.payload.currentTarget.id) {
                    return {
                      ...output,
                      value: output.value,
                      isLinked: true,
                    }
                  } else return output
                }),
            }
          } else return node
        }),
      }

    case 'ENTER_PORT':
      return {
        ...state,
        streams: state.streams.map((stream) => {
          if (stream.isActive) {
            return {
              ...stream,
              stroke: 'deeppink',
            }
          } else return stream
        }),
        nodes: state.nodes.map((node) => {
          return {
            ...node,
            inputs:
              node.inputs &&
              node.inputs.map((input) => {
                if (state.streams.find((stream) => stream.isActive)) {
                  return {
                    ...input,
                    isHovered: true,
                  }
                } else return input
              }),
            outputs:
              node.outputs &&
              node.outputs.map((output) => {
                if (state.streams.find((stream) => stream.isActive)) {
                  return {
                    ...output,
                    isHovered: true,
                  }
                } else return output
              }),
          }
        }),
      }

    case 'LEAVE_PORT':
      return {
        ...state,
        streams: state.streams.map((stream) => {
          return {
            ...stream,
            stroke: stream.isLinked ? 'deeppink' : '',
          }
        }),
        nodes: state.nodes.map((node) => {
          return {
            ...node,
            inputs:
              node.inputs &&
              node.inputs.map((input) => {
                if (state.streams.find((stream) => stream.isActive)) {
                  return {
                    ...input,
                    isHovered: false,
                  }
                } else return input
              }),
            outputs:
              node.outputs &&
              node.outputs.map((output) => {
                if (state.streams.find((stream) => stream.isActive)) {
                  return {
                    ...output,
                    isHovered: false,
                  }
                } else return output
              }),
          }
        }),
      }

    case 'UNLINK_STREAM': {
      const stream = state.streams.find(
        (stream) =>
          stream.source.id === action.payload.currentTarget.id ||
          stream.target.id === action.payload.currentTarget.id
      )

      return {
        ...state,
        nodes: state.nodes.map((node) => {
          return {
            ...node,
            outputs:
              node.outputs &&
              node.outputs.map((output) => {
                if (
                  output.id === stream?.source.id ||
                  output.id === stream?.target.id
                ) {
                  return {
                    ...output,
                    isLinked: false,
                  }
                } else return output
              }),
            inputs:
              node.inputs &&
              node.inputs.map((input) => {
                if (
                  input.id === stream?.source.id ||
                  input.id === stream?.target.id
                ) {
                  return {
                    ...input,
                    isLinked: false,
                  }
                } else return input
              }),
          }
        }),
        streams: state.streams
          .map((stream) => {
            if (
              stream.source.id === action.payload.currentTarget.id ||
              stream.target.id === action.payload.currentTarget.id
            ) {
              return {
                ...stream,
                isLinked: false,
              }
            } else return stream
          })
          .filter((stream) => stream.isLinked),
      }
    }

    default:
      throw Error('Unknown action: ' + action.type)
  }
}
