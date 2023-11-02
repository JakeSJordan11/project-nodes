import { PortProps } from "@/types/port";
import { Coordinate, Id, Value } from "@/types/utils";

export interface NodeProps {
  id: Id;
  title: NodeVariant;
  value: Value;
  kind: NodeKind;
  variant: NodeVariant;
  position: Coordinate;
  offset: Coordinate;
  status: NodeStatus;
  ports: PortProps[];
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
