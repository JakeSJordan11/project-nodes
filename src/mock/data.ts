import { NodeProps, NodeVariant } from '@/types/node'

export const mockNodes = [
  {
    id: '0',
    value: 0,
    position: { x: 50, y: 50 },
    variant: NodeVariant.Input,
    outputValue: 0,
    outputId: '0-0',
  } as NodeProps,
  {
    id: '1',
    value: 0,
    position: { x: 50, y: 300 },
    variant: NodeVariant.Input,
    outputValue: 0,
    outputId: '1-0',
  } as NodeProps,
  {
    id: '2',
    value: 0,
    position: { x: 300, y: 175 },
    variant: NodeVariant.Operator,
    input1Id: '2-0',
    input1Value: 0,
    input2Id: '2-1',
    input2Value: 0,
    outputValue: 0,
    outputId: '2-2',
  } as NodeProps,
  {
    id: '3',
    value: 0,
    position: { x: 550, y: 175 },
    variant: NodeVariant.Output,
    inputId: '3-0',
    inputValue: 0,
  } as NodeProps,
]
