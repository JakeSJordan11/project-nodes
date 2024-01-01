import { NodeVariant } from '@/enums/node'
import type { NodeProps } from '@/types/node'
import { Addition } from './addition'
import { Blend } from './blend'
import { Boolean } from './boolean'
import { Color } from './color'
import { Division } from './division'
import { Exponent } from './exponent'
import { Float } from './float'
import { Integer } from './integer'
import { Modulo } from './modulo'
import { Multiplication } from './multiplication'
import { Result } from './result'
import { String } from './string'
import { Subtraction } from './subtraction'
import { Webgpu } from './webgpu'

export function Node({ ...node }: NodeProps) {
  switch (node.variant) {
    case NodeVariant.Integer:
      return <Integer {...node} />
    case NodeVariant.Float:
      return <Float {...node} />
    case NodeVariant.Boolean:
      return <Boolean {...node} />
    case NodeVariant.String:
      return <String {...node} />
    case NodeVariant.Addition:
      return <Addition {...node} />
    case NodeVariant.Subtraction:
      return <Subtraction {...node} />
    case NodeVariant.Multiplication:
      return <Multiplication {...node} />
    case NodeVariant.Division:
      return <Division {...node} />
    case NodeVariant.Modulo:
      return <Modulo {...node} />
    case NodeVariant.Exponentiation:
      return <Exponent {...node} />
    case NodeVariant.Result:
      return <Result {...node} />
    case NodeVariant.Color:
      return <Color {...node} />
    case NodeVariant.Blend:
      return <Blend {...node} />
    case NodeVariant.WebGpu:
      return <Webgpu {...node} />
  }
}
