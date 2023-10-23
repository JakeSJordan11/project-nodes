import { HTMLProps, PointerEventHandler, PropsWithoutRef } from 'react'

export interface PortProps extends Omit<HTMLProps<HTMLButtonElement>, 'value'> {
  nodeId: string
  id: string
  value: string | number | boolean
  kind: PortKind
  status: PortStatus
  onPointerUp: PointerEventHandler<HTMLButtonElement>
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
