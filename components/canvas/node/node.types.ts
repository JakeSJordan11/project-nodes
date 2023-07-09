import type { PropsWithRef } from "react";
import type { PortProps } from "./port";

export interface NodeProps extends PropsWithRef<HTMLDivElement> {
  id: string;
  title: "Number" | "Operator";
  type: "number" | "operator";
  value: number;
  isActive: boolean;
  offset: { x: number; y: number };
  position: { x: number; y: number };
  inputs: PortProps[];
  outputs: PortProps[];
}
