import { NodeVariant, type NodeProps } from '@/types/node'
import type { StreamProps } from '@/types/stream'
import type { Coordinate } from '@/types/utility'

export enum CanvasContextMenuStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export interface CanvasState {
  nodes: NodeProps[]
  streams: StreamProps[]
}

export enum CanvasActionType {
  CreateNode = 'CREATE_NODE',
  SelectNode = 'SELECT_NODE',
  DropOnCanvas = 'DROP_ON_CANVAS',
  MoveOnCanvas = 'MOVE_ON_CANVAS',
  UpdateNodeValue = 'UPDATE_NODE_VALUE',
  CreateStream = 'CREATE_STREAM',
  LinkStream = 'LINK_STREAM',
}

type CreateNode = {
  type: CanvasActionType.CreateNode
  payload: { nodeVariant: NodeVariant; nodePosition: Coordinate }
}

type SelectNode = {
  type: CanvasActionType.SelectNode
  payload: { nodeId: string; nodePosition: Coordinate }
}

type DropOnCanvas = {
  type: CanvasActionType.DropOnCanvas
}

type MoveOnCanvas = {
  type: CanvasActionType.MoveOnCanvas
  payload: { canvasPointerPosition: Coordinate }
}

type UpdateNodeValue = {
  type: CanvasActionType.UpdateNodeValue
  payload: { nodeId: string; nodeValue: number }
}

type CreateStream = {
  type: CanvasActionType.CreateStream
  payload: { nodeId: string; portId: string; portBounds: DOMRect }
}

type LinkStream = {
  type: CanvasActionType.LinkStream
  payload: { nodeId: string; portId: string; portBounds: DOMRect }
}

export type CanvasAction =
  | CreateNode
  | SelectNode
  | DropOnCanvas
  | MoveOnCanvas
  | UpdateNodeValue
  | CreateStream
  | LinkStream
