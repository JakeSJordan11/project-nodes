import { StreamStatus } from '@/enums/stream'

export interface StreamProps {
  id: string | undefined
  value: number | boolean | string | undefined
  m: string
  l?: string
  status: StreamStatus
  sourceId: string | undefined
  targetId?: string | undefined
  source: HTMLButtonElement
  target: HTMLButtonElement | null
}
