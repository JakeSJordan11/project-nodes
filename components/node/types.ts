import type { Dispatch, PointerEventHandler, SetStateAction } from "react";

export interface NodeProps extends React.HTMLAttributes<HTMLElement> {
  inputs?: number;
  outputs?: number;
  onPortPointerDown?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerOver?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerUp?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerEnter?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerLeave?: PointerEventHandler<HTMLButtonElement> | undefined;
  onNodePointerMove?: Dispatch<SetStateAction<{ x: number; y: number }>>;
}
