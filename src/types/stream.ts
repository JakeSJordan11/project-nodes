import { Ref, RefObject } from "react";
import { Id, Value } from "./utils";

export interface StreamProps {
  id: Id;
  value: Value;
  m: string;
  l?: string;
  status: StreamStatus;
  source: HTMLButtonElement;
  target: HTMLButtonElement | null;
}

export enum StreamStatus {
  Idle = "idle",
  Active = "active",
  Linked = "linked",
}
