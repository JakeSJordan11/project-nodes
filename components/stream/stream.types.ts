import type { SVGProps } from "react";

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
