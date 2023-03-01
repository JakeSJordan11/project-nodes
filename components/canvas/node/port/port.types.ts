import type { PropsWithRef } from "react";

export interface PortProps extends PropsWithRef<HTMLButtonElement> {
  value: any;
  isLinked: boolean;
  isHovered: boolean;
}
