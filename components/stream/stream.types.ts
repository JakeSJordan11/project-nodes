import type { CSSProperties, SVGProps } from "react";

export interface StreamData {
  streamId?: number;
  m?: string;
  l?: string;
  isActive?: boolean;
  isLinked?: boolean;
  isReadyToLink?: boolean;
  streamColor?: CSSProperties["color"];
  streamTarget?: HTMLButtonElement;
  streamSource?: HTMLButtonElement;
}

export type StreamProps = SVGProps<SVGPathElement>;
