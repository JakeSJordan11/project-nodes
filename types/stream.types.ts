import type { PortProps } from "@/types/port.types";

export interface StreamProps {
  id: string;
  streamValue: number;
  isActive: boolean;
  isLinked: boolean;
  m: string;
  l: string;
  sourcePort: PortProps;
  targetPort: PortProps;
  sourcePortId: string;
  targetPortId: string;
  sourceNodeId: string;
  targetNodeId: string;
}
