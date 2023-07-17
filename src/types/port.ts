import { portStatus, portTypes } from "@/constants/port";

export interface PortProps {
  id: string;
  type: portTypes;
  value: number;
  status: portStatus;
  nodeId: string;
  linkedNodeId: string;
  linkedPortId: string;
}
