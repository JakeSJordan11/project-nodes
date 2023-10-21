import { PortStatus } from '@/types/port'
import type { ChangeEvent, PointerEvent, ReactNode } from 'react'

export interface NodeProps {
  id: string
  value: number
  position: { x: number; y: number }
  status?: NodeStatus
  variant: NodeVariant
  outputId: string
  outputStatus?: PortStatus
  outputValue: number
  input1Id: string
  input1Status?: PortStatus
  input1Value: number
  input2Id: string
  input2Status?: PortStatus
  input2Value: number
  inputId: string
  inputStatus?: PortStatus
  inputValue: number
  onNodeValueChange: (event: ChangeEvent<HTMLInputElement>, id: string) => void
  onPortPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    id: string
  ) => void
  onPortPointerUp: (event: PointerEvent<HTMLButtonElement>, id: string) => void
}

export enum NodeVariant {
  Input = 'input',
  Output = 'output',
  Operator = 'operator',
}

export enum NodeStatus {
  Idle = 'inactive',
  Active = 'active',
}
