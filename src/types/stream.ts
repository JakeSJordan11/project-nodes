import { Value } from '@/types/utils'

export interface StreamProps {
  id: string
  value?: Value
  m: string
  l: string
  status: StreamStatus
  source: HTMLButtonElement
  target?: HTMLButtonElement
}

export enum StreamStatus {
  Idle = 'idle',
  Active = 'active',
  Linked = 'linked',
}
