import { Id, Value } from "./utils";

export interface StreamProps {
  id: Id;
  value: Value;
  m: string;
  l?: string;
  status: StreamStatus;
  sourceElement: HTMLButtonElement;
  targetElement?: HTMLButtonElement;
  sourceNodeId: Id;
  targetNodeId?: Id;
  sourcePortId: Id;
  targetPortId?: Id;
}

export enum StreamStatus {
  Idle = "idle",
  Active = "active",
  Linked = "linked",
}
