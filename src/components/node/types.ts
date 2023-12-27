import type { PortProps } from '../port/types'
import { NodeKind, NodeStatus, NodeVariant } from './enums'

export interface NodeProps {
  id: string | undefined
  value: number | boolean | string | undefined
  kind: NodeKind
  variant: NodeVariant
  position: { x: number; y: number }
  offset: { x: number; y: number }
  status: NodeStatus
  ports: PortProps[]
}
