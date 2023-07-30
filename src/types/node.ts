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
