export enum StreamStatus {
  Dragging = 'active',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface StreamProps {
  id: string | undefined
  m: string
  l?: string
  status: StreamStatus

  // this is duplicated state, I should be able to derive this from the global state of the port
  // but I have not figured out how to do that yet for the streams
  value: number | boolean | string | undefined // this is duplicate state as well because it is the same as it's linked port value which is in state
  sourceId: string | undefined
  targetId?: string | undefined
  source: HTMLButtonElement
  target: HTMLButtonElement | null
}
