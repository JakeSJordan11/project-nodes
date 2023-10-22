import { Coordinate } from '@/types/utils'

export interface Node {
  id: string
  position: Coordinate
  type: NodeType
}

export enum NodeType {
  Integer = 'integer',
  Addition = 'addition',
  Output = 'output',
}
