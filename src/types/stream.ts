export interface StreamProps {
  id: string
  from: string
  to: string
  status: StreamStatus
}

export enum StreamStatus {
  Inactive = 'inactive',
  Active = 'active',
  Linked = 'linked',
}
