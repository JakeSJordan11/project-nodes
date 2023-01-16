import type { PointerEventHandler, ReactNode } from "react";

export interface NodeData {
  id: string;
  title: string;
  type: "input" | "output" | "default";
  isActive: boolean;
  offset: { x: number; y: number };
  position: { x: number; y: number };
  draggable: boolean;
}

export interface NodeProps extends NodeData {
  children: ReactNode;
  onPointerDown: PointerEventHandler<HTMLElement>;
}
