import type { HTMLAttributes } from "react";

type NodeTypes = "input" | "output" | "default";
type NodeCoordinates = { x: number; y: number };

export interface NodeData {
  nodeId?: number;
  nodeType?: NodeTypes;
  nodeTitle?: string;
  isActive?: boolean;
  nodePosition?: NodeCoordinates;
  nodeOffset?: NodeCoordinates;
  portIds?: number[];
}

export type NodeProps = HTMLAttributes<HTMLElement>;
