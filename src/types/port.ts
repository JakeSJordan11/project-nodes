import { PointerEvent } from "react";
import { Id, Value } from "./utils";

export interface PortState {
  id: Id;
  value: Value;
  kind: PortKind;
  status: PortStatus;
}

export interface PortProps extends PortState {
  onPointerUp: (
    event: PointerEvent<HTMLButtonElement>,
    portId: PortState["id"],
    portValue: PortState["value"]
  ) => void;
  onPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    portId: PortState["id"],
    portValue: PortState["value"]
  ) => void;
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
