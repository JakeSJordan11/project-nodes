export interface StreamProps {
  id: string
  value: number
  m: string
  l: string
  status: StreamStatus
}

export enum StreamStatus {
  Idle = 'idle',
  Active = 'active',
  Linked = 'linked',
}
