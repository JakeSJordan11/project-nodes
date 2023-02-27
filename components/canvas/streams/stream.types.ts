import type { SVGProps } from "react";

export interface StreamProps {
  id: string;
  isActive: boolean;
  isLinked: boolean;
  target: HTMLButtonElement | null;
  source: HTMLButtonElement | null;
  d: SVGProps<SVGPathElement>["d"];
  stroke: SVGProps<SVGPathElement>["stroke"];
}
