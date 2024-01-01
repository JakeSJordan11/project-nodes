import { PortKind, PortStatus } from '@/enums/port'

export interface PortProps {
  nodeId?: string | undefined
  id: string | undefined
  value: number | boolean | string | undefined
  kind: PortKind
  status: PortStatus
}
