import type { ButtonHTMLAttributes } from "react";

type PortTypes = "input" | "output";
export interface PortData {
  portId: number;
  nodeId: number;
  portType: PortTypes;
  portName: string;
}

export type PortProps = ButtonHTMLAttributes<HTMLButtonElement>;
