import type { SVGProps } from "react";

export interface NodeData {
  id: string;
  title: string;
  type: "input" | "output" | "default";
  isActive: boolean;
  offset: { x: number; y: number };
  position: { x: number; y: number };
}

export interface PortData {
  id: string;
  parentId: string;
  isLinked: boolean;
  title: string;
  type: "input" | "output";
}

export interface StreamData {
  id: string;
  isActive: boolean;
  isLinked: boolean;
  isReadyToLink: boolean;
  target: HTMLButtonElement | null;
  source: HTMLButtonElement | null;
  d: SVGProps<SVGPathElement>["d"];
  stroke: SVGProps<SVGPathElement>["stroke"];
}
