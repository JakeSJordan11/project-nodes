import type { ChangeEvent, PointerEvent, ReactNode } from 'react'

export interface NodeProps {
  id: string
  value: number
  linkedNodeIds?: string[]
  status?: NodeStatus
  variant: NodeVariant
  position: { x: number; y: number }
  outputs?: ReactNode
  inputs?: ReactNode
  operator?: Operator
  onNodeValueChange?: (event: ChangeEvent<HTMLInputElement>, id: string) => void
  onOperatorChange?: (event: ChangeEvent<HTMLSelectElement>) => void
  onPortPointerDown?: (
    event: PointerEvent<HTMLButtonElement>,
    id: string
  ) => void
  onPortPointerUp?: (event: PointerEvent<HTMLButtonElement>, id: string) => void
}

export enum NodeVariant {
  Input = 'input',
  Output = 'output',
  Operator = 'operator',
}

export enum NodeStatus {
  Inactive = 'inactive',
  Active = 'active',
  Linking = 'linking',
}

export enum Operator {
  Addition = 'addition',
  Subtraction = 'subtraction',
  Multiplication = 'multiplication',
  Division = 'division',
  Modulo = 'modulo',
  Exponentiation = 'exponentiation',
}
