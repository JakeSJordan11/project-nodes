import { Coordinate } from '@/types/utility'

export interface NodeProps {
  id: string
  value: number
  variant: NodeVariant
  status: NodeStatus
  offset: Coordinate
  position: Coordinate
}

export enum NodeVariant {
  Number = 'NUMBER',
  Operator = 'OPERATOR',
}

export enum NodeStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Linked = 'LINKED',
}

export type NodeState = NodeProps[]

export enum NodeActionType {
  CreateNode = 'CREATE_NODE',
}

type SelectNode = { type: NodeActionType.CreateNode; payload: NodeVariant }

export type NodeAction = SelectNode
