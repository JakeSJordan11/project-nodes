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
