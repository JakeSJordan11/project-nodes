import { Number } from '@/components/number'
import { Operator } from '@/components/operator'
import { Inputs } from '@/components/port.inputs'
import { Outputs } from '@/components/port.outputs'
import type { NodeProps } from '@/types/node'

export function Content({ ...node }: NodeProps) {
  switch (node.type) {
    case 'number':
      return (
        <>
          <Number {...node} />
          <Outputs {...node} />
        </>
      )
    case 'operator':
      return (
        <>
          <Inputs {...node} />
          <Operator {...node} />
        </>
      )

    default:
      return null
  }
}
