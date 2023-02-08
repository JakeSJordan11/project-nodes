import { MouseEventHandler, PointerEventHandler } from "react";

export interface PortData {
  id: string;
  parentId: string;
  title: string;
  isLinked: boolean;
  type: "input" | "output";
}

export interface PortProps extends PortData {
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onPointerEnter: PointerEventHandler<HTMLButtonElement>;
  onPointerLeave: PointerEventHandler<HTMLButtonElement>;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
}
