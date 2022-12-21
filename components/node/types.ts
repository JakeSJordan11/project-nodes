import type { PointerEventHandler } from "react";

export interface NodeProps extends React.HTMLAttributes<HTMLElement> {
  inputs?: number;
  outputs?: number;
  onPortPointerDown?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerUp?: PointerEventHandler<HTMLButtonElement> | undefined;
}
