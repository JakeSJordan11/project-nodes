import type { NodeProps } from "src/types/node.types";
import type { StreamProps } from "src/types/stream.types";
import type { ChangeEvent, MouseEvent, PointerEvent } from "react";

export type CanvasState = {
  nodes: NodeProps[];
  streams: StreamProps[];
};

export enum CanvasActionType {
  SELECT_NODE = "SELECT_NODE",
  CREATE_NUMBER_NODE = "CREATE_NUMBER_NODE",
  CREATE_OPERATOR_NODE = "CREATE_OPERATOR_NODE",
  CHANGE_VALUE_SLIDER = "CHANGE_VALUE_SLIDER",
  DRAG_SELECTION = "DRAG_SELECTION",
  DROP_SELECTION = "DROP_SELECTION",
  CREATE_STREAM = "CREATE_STREAM",
  LINK_STREAM = "LINK_STREAM",
  UNLINK_STREAM = "UNLINK_STREAM",
  ENTER_PORT = "ENTER_PORT",
  LEAVE_PORT = "LEAVE_PORT",
  LEAVE_CANVAS = "LEAVE_CANVAS",
  REMOVE_NODE = "REMOVE_NODE",
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

type DropSelection = {
  type: CanvasActionType.DROP_SELECTION;
  payload?: PointerEvent<HTMLElement>;
};

type CreateStream = {
  type: CanvasActionType.CREATE_STREAM;
  payload: PointerEvent<HTMLButtonElement>;
};

type LinkStream = {
  type: CanvasActionType.LINK_STREAM;
  payload: PointerEvent<HTMLButtonElement>;
};

type UnlinkStream = {
  type: CanvasActionType.UNLINK_STREAM;
  payload: MouseEvent<HTMLButtonElement>;
};

type EnterPort = {
  type: CanvasActionType.ENTER_PORT;
  payload: PointerEvent<HTMLButtonElement>;
};

type LeavePort = {
  type: CanvasActionType.LEAVE_PORT;
  payload: PointerEvent<HTMLButtonElement>;
};

type LeaveCanvas = { type: CanvasActionType.LEAVE_CANVAS };

type RemoveNode = {
  type: CanvasActionType.REMOVE_NODE;
  payload: { id: string };
};

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
  | RemoveNode;
