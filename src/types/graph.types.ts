import { EdgeProps } from '@/types/edge.types'
import { NodeProps } from '@/types/node.types'

export interface GraphState {
  nodes: NodeProps[]
  edges: EdgeProps[]
}
