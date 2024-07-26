import { PortProps } from '@/types/port.types'

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
  ports: PortProps[]
  position: { x: number; y: number }
  isSelected?: boolean
  isDragging?: boolean
  variant: NodeVariant
  mathOperation?: MathOperation
  title: string

  value: number | boolean | string | undefined // TODO: derive this state from node variant
  offset: { x: number; y: number } // TODO: derive this state this may need to be created locally, but I don't think it needs to be in the global state
  scrollPosition: { x: number; y: number } // TODO: derive this state
}
