export interface StreamProps {
  value: number
  id: string
  from: string
  to: string
  status: StreamStatus
  sourceNodeId: string
  targetNodeId: string
  sourcePortId: string
  targetPortId: string
}

export enum StreamStatus {
  Idle = 'idle',
  Active = 'active',
  Linked = 'linked',
}
