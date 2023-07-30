export interface StreamProps {
  id: string
  from: string
  to: string
  sourcePortId: string
  targetPortId: string
  sourceNodeId: string
  targetNodeId: string
  status: StreamStatus
}

export enum StreamStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Linked = 'LINKED',
}
