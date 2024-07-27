import { VertexProps } from '@/types'

export enum NodeVariant {
  Number = 'number',
  Math = 'math',
}

export enum MathOperation {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
  Modulo = '%',
  Power = '**',
}

export interface NodeProps {
  id: string
  vertices: VertexProps[]
  position: { x: number; y: number }
  isSelected?: boolean
  isDragging?: boolean
  variant: NodeVariant
  mathOperation?: MathOperation
  title: string
  value: number | boolean | string | undefined
  offset: { x: number; y: number }
  scrollPosition: { x: number; y: number }
}
