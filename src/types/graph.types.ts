import { NodeProps } from '@/types/node.types'
import { StreamProps } from '@/types/stream.types'

export interface GraphState {
  nodes: NodeProps[]
  streams: StreamProps[]
}
