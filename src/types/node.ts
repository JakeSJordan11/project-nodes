import { PortState } from "@/types/port";
import { Coordinate, Id, Value } from "@/types/utils";
import { ChangeEvent, PointerEvent } from "react";

export interface NodeState {
  id: Id;
  title: NodeVariant;
  value: Value;
  kind: NodeKind;
  variant: NodeVariant;
  position: Coordinate;
  offset: Coordinate;
  status: NodeStatus;
  ports: PortState[];
}

export interface NodeProps extends NodeState {
  onNodePointerDown: (
    event: PointerEvent<HTMLElement>,
    nodeId: NodeState["id"]
  ) => void;
  onPortPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    portId: PortState["id"],
    portValue: PortState["value"],
    nodeId: NodeState["id"],
    nodeValue: NodeState["value"]
  ) => void;
  onPortPointerUp: (
    event: PointerEvent<HTMLButtonElement>,
    portId: PortState["id"],
    portValue: PortState["value"],
    nodeId: NodeState["id"],
    nodeValue: NodeState["value"]
  ) => void;
  onValueChange: (
    event: ChangeEvent<HTMLInputElement>,
    id: NodeState["id"]
  ) => void;
}

export enum NodeKind {
  Input = "input",
  Operator = "operator",
  Output = "output",
}

export enum NodeVariant {
  Addition = "addition",
  Subtraction = "subtraction",
  Multiplication = "multiplication",
  Division = "division",
  Modulo = "modulo",
  Power = "power",
  Integer = "integer",
  Float = "float",
  Boolean = "boolean",
  String = "string",
  Result = "result",
  Export = "export",
}

export enum NodeStatus {
  Idle = "idle",
  Active = "active",
}
