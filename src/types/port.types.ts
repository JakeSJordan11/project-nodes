export enum PortKind {
  Input = 'input',
  Output = 'output',
}

export enum PortStatus {
  Idle = 'idle',
  Active = 'active',
  Connected = 'connected',
}

export interface PortProps {
  id: string
  status: PortStatus
  kind: PortKind // TODO: derive this state from node kind operators have inputs and outputs, numbers have inputs
  nodeId?: string | undefined // this is duplicated state, I should be able to derive this from the global state of the node
  value: number | boolean | string | undefined // TODO: derive this state from node variant
}
