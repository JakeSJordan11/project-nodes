import { Addition } from './addition/component'
import { Blend } from './blend/component'
import { Boolean } from './boolean/component'
import { Color } from './color/component'
import { Division } from './division/component'
import { NodeVariant } from './enums'
import { Exponent } from './exponent/component'
import { Float } from './float/component'
import { Integer } from './integer/component'
import { Modulo } from './modulo/component'
import { Multiplication } from './multiplication/component'
import { Result } from './result/component'
import { String } from './string/component'
import { Subtraction } from './subtraction/component'
import type { NodeProps } from './types'
import { Webgpu } from './webgpu/component'

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
    case NodeVariant.Power:
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
