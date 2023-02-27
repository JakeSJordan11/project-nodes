import type { PortProps } from "./ports";

export interface NodeProps {
  id: string;
  title: string;
  type: "number" | "operator";
  isActive: boolean;
  offset: { x: number; y: number };
  position: { x: number; y: number };
  value: number;
  inputs: PortProps[];
  outputs: PortProps[];
}
