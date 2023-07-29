export interface StreamProps {
  id: string
  from: string
  to: string
  status: StreamStatus
}

export enum StreamStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Linked = 'LINKED',
}

export type StreamState = StreamProps[]

export enum StreamActionType {
  CreateStream = 'CREATE_STREAM',
}

type CreateStream = { type: StreamActionType.CreateStream }

export type StreamAction = CreateStream
