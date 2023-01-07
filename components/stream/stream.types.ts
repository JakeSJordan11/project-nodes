import { SVGProps } from "react";

export interface StreamData {
  m?: string;
  l?: string;
  isActive?: boolean;
  streamId?: number;
  isLinked?: boolean;
}

export type StreamProps = SVGProps<SVGPathElement>;
