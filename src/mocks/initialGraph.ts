import { NodeStatus, NodeVariants } from '@/constants/node.constant'
import type { GraphState } from '@/types'

export const initialGraph: GraphState = {
  streams: [],
  nodes: [
    {
      id: crypto.randomUUID(),
      value: 0,
      status: NodeStatus.Inactive,
      variant: NodeVariants.Input,
      linkedIds: [],
      position: { x: 50, y: 50 },
    },
    {
      id: crypto.randomUUID(),
      value: 0,
      status: NodeStatus.Inactive,
      variant: NodeVariants.Input,
      linkedIds: [],
      position: { x: 50, y: 250 },
    },
    {
      id: crypto.randomUUID(),
      value: 0,
      status: NodeStatus.Inactive,
      variant: NodeVariants.Input,
      linkedIds: [],
      position: { x: 50, y: 450 },
    },
    {
      id: crypto.randomUUID(),
      value: 0,
      status: NodeStatus.Inactive,
      variant: NodeVariants.Operator,
      linkedIds: [],
      position: { x: 250, y: 150 },
    },
    {
      id: crypto.randomUUID(),
      value: 0,
      status: NodeStatus.Inactive,
      variant: NodeVariants.Operator,
      linkedIds: [],
      position: { x: 250, y: 350 },
    },
    {
      id: crypto.randomUUID(),
      value: 0,
      status: NodeStatus.Inactive,
      variant: NodeVariants.Operator,
      linkedIds: [],
      position: { x: 450, y: 250 },
    },
    {
      id: crypto.randomUUID(),
      value: 0,
      status: NodeStatus.Inactive,
      variant: NodeVariants.Output,
      linkedIds: [],
      position: { x: 650, y: 250 },
    },
  ],
}
