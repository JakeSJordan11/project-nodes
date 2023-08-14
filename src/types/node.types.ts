import { NodeStatus, NodeVariants, OperationVariants } from '@/constants/node.constant'
import { Coordinate } from '@/types/utility.types'

export interface NodeProps {
  id: string
  value: number
  status: NodeStatus
  variant: NodeVariants
  position: Coordinate
  linkedIds?: string[]
  operation?: OperationVariants
}
