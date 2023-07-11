import type { PortProps } from "@/types/port.types";
import type { PropsWithRef } from "react";

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
