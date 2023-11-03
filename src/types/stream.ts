import { Id, Value } from '@/types/utils'

export interface StreamProps {
  id: Id
  value: Value
  m: string
  l?: string
  status: StreamStatus
  sourceId: Id
  targetId?: Id
  source: HTMLButtonElement
  target: HTMLButtonElement | null
}

export enum StreamStatus {
  Active = 'active',
  Linked = 'linked',
}
