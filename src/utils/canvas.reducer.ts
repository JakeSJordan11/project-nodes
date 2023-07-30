import { type CanvasAction, type CanvasState } from '@/types/canvas'
import { NodeStatus, NodeVariant } from '@/types/node'
import { PortStatus, PortVariant } from '@/types/port'
import { StreamProps, StreamStatus } from '@/types/stream'

export function canvasReducer(
  state: CanvasState,
  action: CanvasAction
): CanvasState {
  switch (action.type) {
    case 'CREATE_NODE': {
      const { nodePosition, nodeVariant } = action.payload
      const newNodes =
        nodeVariant === NodeVariant.Number
          ? [
              ...state.nodes,
              {
                id: crypto.randomUUID(),
                value: 0,
                variant: nodeVariant,
                status: NodeStatus.Inactive,
                offset: { x: 0, y: 0 },
                position: nodePosition,
                ports: [
                  {
                    id: crypto.randomUUID(),
                    variant: PortVariant.Output,
                    status: PortStatus.Inactive,
                  },
                ],
              },
            ]
          : nodeVariant === NodeVariant.Operator
          ? [
              ...state.nodes,
              {
                id: crypto.randomUUID(),
                value: 0,
                variant: nodeVariant,
                status: NodeStatus.Inactive,
                offset: { x: 0, y: 0 },
                position: nodePosition,
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
          : state.nodes
      return {
        nodes: newNodes,
        streams: state.streams,
      }
    }

    case 'SELECT_NODE': {
      const { nodeId, nodePosition } = action.payload
      const selectedNode = state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              status: NodeStatus.Active,
              offset: {
                x: nodePosition.x - node.position.x,
                y: nodePosition.y - node.position.y,
              },
            }
          : { ...node, status: NodeStatus.Inactive }
      )
      return {
        nodes: selectedNode,
        streams: state.streams,
      }
    }

    case 'DROP_ON_CANVAS': {
      const deselectedNodes = state.nodes.map((node) =>
        node.status === NodeStatus.Active
          ? { ...node, status: NodeStatus.Inactive }
          : node
      )
      const releasedStream = state.streams.map((stream) =>
        stream.status === StreamStatus.Active
          ? { ...stream, status: StreamStatus.Inactive }
          : stream
      )
      return {
        nodes: deselectedNodes,
        streams: releasedStream.filter(
          (stream) => stream.status === StreamStatus.Linked
        ),
      }
    }

    case 'MOVE_ON_CANVAS': {
      const { canvasPointerPosition } = action.payload
      const movedSelectedNode = state.nodes.map((node) =>
        node.status === NodeStatus.Active
          ? {
              ...node,
              position: {
                x: canvasPointerPosition.x - node.offset.x,
                y: canvasPointerPosition.y - node.offset.y,
              },
            }
          : node
      )
      const movedActiveStrem = state.streams.map((stream) =>
        stream.status === StreamStatus.Active
          ? {
              ...stream,
              to: `L ${canvasPointerPosition.x} ${canvasPointerPosition.y}`,
            }
          : stream
      )
      return {
        nodes: movedSelectedNode,
        streams: movedActiveStrem,
      }
    }

    case 'UPDATE_NODE_VALUE': {
      const { nodeId, nodeValue } = action.payload
      const updatedNodeValue = state.nodes.map((node) =>
        node.id === nodeId ? { ...node, value: nodeValue } : node
      )
      return {
        nodes: updatedNodeValue,
        streams: state.streams,
      }
    }

    case 'CREATE_STREAM': {
      const { nodeId, portId, portBounds } = action.payload
      const newStreams = [
        ...state.streams,
        {
          id: crypto.randomUUID(),
          from: `M ${portBounds.x + portBounds.width / 2} ${
            portBounds.y + portBounds.height / 2
          } `,
          to: `L ${portBounds.x + portBounds.width / 2} ${
            portBounds.y + portBounds.height / 2
          }`,
          status: StreamStatus.Active,
          sourcePortId: portId,
          sourceNodeId: nodeId,
          targetPortId: '',
          targetNodeId: '',
        },
      ]
      const activatePort = state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              ports: node.ports.map((port) =>
                port.id === portId
                  ? { ...port, status: PortStatus.Active }
                  : port
              ),
            }
          : node
      )

      return {
        nodes: activatePort,
        streams: newStreams,
      }
    }

    case 'LINK_STREAM': {
      const { nodeId, portId, portBounds } = action.payload
      const releasedStream = state.streams.map((stream) =>
        stream.status === StreamStatus.Active
          ? {
              ...stream,
              status: StreamStatus.Linked,
              to: `L ${portBounds.x + portBounds.width / 2} ${
                portBounds.y + portBounds.height / 2
              }`,
              targetPortId: portId,
              targetNodeId: nodeId,
            }
          : stream
      )
      return {
        nodes: state.nodes,
        streams: releasedStream,
      }
    }

    default:
      throw Error('Unknown action: ' + action.type)
  }
}
