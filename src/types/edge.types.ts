export enum EdgeStatus {
  Dragging = 'active',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface EdgeProps {
  id: string | undefined
  m: string
  l?: string
  status: EdgeStatus
  value: number | boolean | string | undefined
  sourceId: string | undefined
  targetId?: string | undefined
  source: HTMLButtonElement
  target: HTMLButtonElement | null
}
