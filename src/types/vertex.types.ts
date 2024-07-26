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
  kind: VertexKind
  nodeId?: string | undefined
  value: number | boolean | string | undefined
}
