import { NodeProps, NodeVariant } from '@/types/node'

export const mockNodes: NodeProps[] = [
  {
    id: '0',
    value: 0,
    position: { x: 50, y: 50 },
    variant: NodeVariant.Input,
  },
  {
    id: '1',
    value: 0,
    position: { x: 50, y: 300 },
    variant: NodeVariant.Input,
  },
  {
    id: '2',
    value: 0,
    position: { x: 300, y: 175 },
    variant: NodeVariant.Operator,
  },
  {
    id: '3',
    value: 0,
    position: { x: 550, y: 175 },
    variant: NodeVariant.Output,
  },
]
