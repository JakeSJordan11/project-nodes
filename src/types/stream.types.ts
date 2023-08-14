import { StreamStatus } from '@/constants/stream.constant'

export interface StreamProps {
  id: string
  from: string
  to: string
  status: StreamStatus
  transmitterId: string
  recieverId: string
}
