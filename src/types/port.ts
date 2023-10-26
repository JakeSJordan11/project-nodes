import { Value } from '@/types/utils'
import { PointerEventHandler } from 'react'

export interface PortState {
  id: string
  value?: Value
  kind: PortKind
  status: PortStatus
}

export interface PortProps extends PortState {
  onPointerUp?: PointerEventHandler<HTMLButtonElement>
  onPointerDown: PointerEventHandler<HTMLButtonElement>
}

export enum PortKind {
  Input = 'input',
  Output = 'output',
}

export enum PortStatus {
  Idle = 'idle',
  Active = 'active',
  Linked = 'linked',
}
