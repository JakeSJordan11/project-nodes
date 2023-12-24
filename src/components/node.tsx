import { AdditionNode } from '@/components/node.addition'
import { BlendNode } from '@/components/node.blend'
import { BooleanNode } from '@/components/node.boolean'
import { ColorNode } from '@/components/node.color'
import { DivisionNode } from '@/components/node.division'
import { FloatNode } from '@/components/node.float'
import { IntegerNode } from '@/components/node.integer'
import { ModuloNode } from '@/components/node.modulo'
import { MultiplicationNode } from '@/components/node.multiplication'
import { PowerNode } from '@/components/node.power'
import { ResultNode } from '@/components/node.result'
import { StringNode } from '@/components/node.string'
import { SubtractionNode } from '@/components/node.subtraction'
import { NodeProps, NodeVariant } from '@/types/node'
import { WebgpuNode } from './node.webgpu'

export function Node({ ...node }: NodeProps) {
  switch (node.variant) {
    case NodeVariant.Integer:
      return <IntegerNode {...node} />
    case NodeVariant.Float:
      return <FloatNode {...node} />
    case NodeVariant.Boolean:
      return <BooleanNode {...node} />
    case NodeVariant.String:
      return <StringNode {...node} />
    case NodeVariant.Addition:
      return <AdditionNode {...node} />
    case NodeVariant.Subtraction:
      return <SubtractionNode {...node} />
    case NodeVariant.Multiplication:
      return <MultiplicationNode {...node} />
    case NodeVariant.Division:
      return <DivisionNode {...node} />
    case NodeVariant.Modulo:
      return <ModuloNode {...node} />
    case NodeVariant.Power:
      return <PowerNode {...node} />
    case NodeVariant.Result:
      return <ResultNode {...node} />
    case NodeVariant.Color:
      return <ColorNode {...node} />
    case NodeVariant.Blend:
      return <BlendNode {...node} />
    case NodeVariant.WebGpu:
      return <WebgpuNode {...node} />
  }
}
