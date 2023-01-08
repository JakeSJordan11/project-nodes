import type { ButtonHTMLAttributes } from "react";

type PortTypes = "input" | "output";
export interface PortData {
  portId: number;
  nodeId: number;
  portType: PortTypes;
  portName: string;
  isLinked: boolean;
  isHovered: boolean;
}

export type PortProps = ButtonHTMLAttributes<HTMLButtonElement>;
