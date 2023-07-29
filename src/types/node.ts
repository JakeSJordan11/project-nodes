import type { PortProps } from '@/types/port'
import type { Coordinate } from '@/types/utility'

export interface NodeProps {
  id: string
  value: number
  variant: NodeVariant
  status: NodeStatus
  offset: Coordinate
  position: Coordinate
  ports: PortProps[]
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

type SelectNode = {
  type: NodeActionType.CreateNode
  payload: { variant: NodeVariant; position: Coordinate }
}

export type NodeAction = SelectNode
