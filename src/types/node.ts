import { PortState } from '@/types/port'
import { Coordinate, Value } from '@/types/utils'
import { ChangeEventHandler, PointerEventHandler } from 'react'

export interface NodeState {
  id: string
  title: NodeVariant
  value?: Value
  kind: NodeKind
  variant: NodeVariant
  position: Coordinate
  offset: Coordinate
  status: NodeStatus
  ports: PortState[]
}

export interface NodeProps extends NodeState {
  onNodePointerDown: PointerEventHandler<HTMLElement>
  onPortPointerDown: PointerEventHandler<HTMLButtonElement>
  onPortPointerUp: PointerEventHandler<HTMLButtonElement>
  onValueChange: ChangeEventHandler<HTMLInputElement>
}

export enum NodeKind {
  Input = 'input',
  Operator = 'operator',
  Output = 'output',
}

export enum NodeVariant {
  Addition = 'addition',
  Subtraction = 'subtraction',
  Multiplication = 'multiplication',
  Division = 'division',
  Modulo = 'modulo',
  Power = 'power',
  Integer = 'integer',
  Float = 'float',
  Boolean = 'boolean',
  String = 'string',
  Result = 'result',
  Export = 'export',
}

export enum NodeStatus {
  Idle = 'idle',
  Active = 'active',
}
