import type { PropsWithRef } from "react";

export interface PortProps extends PropsWithRef<HTMLButtonElement> {
  id: string;
  portType: "input" | "output";
  portValue: number;
  isLinked: boolean;
  isHovered: boolean;
  nodeId: string;
  linkedPortId: string;
  linkedPort: PortProps | null;
}
