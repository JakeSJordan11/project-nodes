export interface StreamProps {
  id: string
  value: string | number | boolean
  m: string
  l: string
  status: StreamStatus
  source: HTMLButtonElement
  target: HTMLButtonElement
}

export enum StreamStatus {
  Idle = 'idle',
  Active = 'active',
  Linked = 'linked',
}
