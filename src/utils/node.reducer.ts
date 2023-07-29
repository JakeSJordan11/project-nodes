import {
  NodeActionType,
  NodeStatus,
  type NodeAction,
  type NodeState,
  NodeVariant,
} from '@/types/node'
import { PortStatus, PortVariant } from '@/types/port'

export function nodeReducer(nodes: NodeState, action: NodeAction) {
  switch (action.type) {
    case NodeActionType.CreateNode: {
      const { variant, position } = action.payload
      if (variant === NodeVariant.Number) {
        return [
          ...nodes,
          {
            id: crypto.randomUUID(),
            value: 0,
            variant: variant,
            status: NodeStatus.Inactive,
            offset: { x: 0, y: 0 },
            position: position,
            ports: [
              {
                id: crypto.randomUUID(),
                variant: PortVariant.Output,
                status: PortStatus.Inactive,
              },
            ],
          },
        ]
      } else if (variant === NodeVariant.Operator) {
        return [
          ...nodes,
          {
            id: crypto.randomUUID(),
            value: 0,
            variant: variant,
            status: NodeStatus.Inactive,
            offset: { x: 0, y: 0 },
            position: position,
            ports: [
              {
                id: crypto.randomUUID(),
                variant: PortVariant.Input,
                status: PortStatus.Inactive,
              },
              {
                id: crypto.randomUUID(),
                variant: PortVariant.Input,
                status: PortStatus.Inactive,
              },
              {
                id: crypto.randomUUID(),
                variant: PortVariant.Output,
                status: PortStatus.Inactive,
              },
            ],
          },
        ]
      } else return nodes
    }

    default:
      throw Error('Unknown action: ' + action.type)
  }
}
