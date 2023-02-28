import type { PortProps } from "./port";

export interface NodeProps {
  id: string;
  title: string;
  type: "number" | "operator";
  value: number;
  isActive: boolean;
  offset: { x: number; y: number };
  position: { x: number; y: number };
  inputs: PortProps[];
  outputs: PortProps[];
}
