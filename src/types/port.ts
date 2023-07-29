export interface PortProps {
  id: string
  variant: PortVariant
  status: PortStatus
}

export enum PortVariant {
  Input = 'INPUT',
  Output = 'OUTPUT',
}

export enum PortStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Linked = 'LINKED',
}

export type PortState = PortProps[]

export enum PortActionType {
  PortPointerDown = 'PORT_POINTER_DOWN',
}

type SelectPort = { type: PortActionType.PortPointerDown }

export type PortAction = SelectPort
