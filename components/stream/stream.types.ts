import type { CSSProperties } from "react";

export interface StreamData {
  id?: string;
  m?: string;
  l?: string;
  isActive?: boolean;
  isLinked?: boolean;
  isReadyToLink?: boolean;
  color?: CSSProperties["color"];
  target?: HTMLButtonElement;
  source?: HTMLButtonElement;
}
