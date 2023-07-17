import { CanvasActionTypes } from "@/constants/canvas.reducer";
import { nodeTypes } from "@/constants/node";
import { portStatus, portTypes } from "@/constants/port";
import type { NodeProps } from "@/types/node";
import type { StreamProps } from "@/types/stream";
import { RefObject } from "react";

export type CanvasState = {
  nodes: NodeProps[];
  streams: StreamProps[];
};

type CreateNode = {
  type: CanvasActionTypes.CreateNode;
  payload: { type: nodeTypes; x: number; y: number };
};

type CreateStream = {
  type: CanvasActionTypes.CreateStream;
  payload: {
    portRef: RefObject<HTMLButtonElement>;
    portType: portTypes;
    portStatus: portStatus;
    id: string;
    nodeId: string;
    fromValue: number;
  };
};

type SelectNode = {
  type: CanvasActionTypes.SelectNode;
  payload: { id: string; x: number; y: number };
};

type DragSelection = {
  type: CanvasActionTypes.DragSelection;
  payload: {
    id: string;
    x: number;
    y: number;
  };
};

type DropSelection = {
  type: CanvasActionTypes.DropSelection;
  payload: { id: string; x: number; y: number };
};

type AttemptLink = {
  type: CanvasActionTypes.AttemptLink;
  payload: {
    portRef: RefObject<HTMLButtonElement>;
    id: string;
    nodeId: string;
    portType: portTypes;
    portStatus: portStatus;
  };
};

type UpdateNode = {
  type: CanvasActionTypes.UpdateNode;
  payload: { id: string; value: number };
};

export type CanvasAction =
  | CreateNode
  | CreateStream
  | SelectNode
  | DragSelection
  | DropSelection
  | AttemptLink
  | UpdateNode;
