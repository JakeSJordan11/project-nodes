import { nodeStatus, nodeTypes } from "@/constants/node";
import type { PortProps } from "@/types/port";

export interface NodeProps {
  id: string;
  type: nodeTypes;
  value: number;
  offset: { x: number; y: number };
  position: { x: number; y: number };
  status: nodeStatus;
  ports: PortProps[];
}
