import { Id, Value } from "./utils";

export interface PortProps {
  id: Id;
  value: Value;
  kind: PortKind;
  status: PortStatus;
}

export enum PortKind {
  Input = "input",
  Output = "output",
}

export enum PortStatus {
  Idle = "idle",
  Active = "active",
  Linked = "linked",
}
