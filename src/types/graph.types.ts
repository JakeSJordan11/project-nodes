import { GraphActionVariants } from '@/constants/graph.constant'
import type { NodeProps, StreamProps } from '@/types'

export interface GraphState {
  streams: StreamProps[]
  nodes: NodeProps[]
}

export type GraphActions = {
  type: GraphActionVariants.OutputPointerDown
}
