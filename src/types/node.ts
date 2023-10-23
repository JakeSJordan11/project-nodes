import { PortProps } from '@/types/port'
import { Coordinate } from '@/types/utils'
import { ChangeEventHandler, PointerEventHandler } from 'react'

export interface NodeProps {
  id: string
  title: string
  value: string | number | boolean
  kind: NodeKind
  variant: NodeVariant
  position: Coordinate
  offset: Coordinate
  status: NodeStatus
  ports: PortProps[]
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
