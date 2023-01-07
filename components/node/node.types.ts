import type { HTMLAttributes } from "react";
import type { PortData, PortProps } from "../port/port.types";

type NodeTypes = "input" | "output" | "default";
type NodeCoordinates = { x: number; y: number };

export interface NodeData {
  nodeId: number;
  nodeType: NodeTypes;
  nodeTitle: string;
  isActive: boolean;
  nodePosition: NodeCoordinates;
  nodeOffset: NodeCoordinates;
  portIds: number[];
}

export interface NodeProps extends HTMLAttributes<HTMLElement> {
  portProps: PortProps;
  ports: PortData[];
}
