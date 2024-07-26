export enum VertexKind {
  Input = 'input',
  Output = 'output',
}

export enum VertexStatus {
  Idle = 'idle',
  Active = 'active',
  Connected = 'connected',
}

export interface VertexProps {
  id: string
  status: VertexStatus
  kind: VertexKind // TODO: derive this state from node kind operators have inputs and outputs, numbers have inputs
  nodeId?: string | undefined // this is duplicated state, I should be able to derive this from the global state of the node
  value: number | boolean | string | undefined // TODO: derive this state from node variant
}
