import type { HTMLAttributes, PointerEventHandler, Ref } from "react";
import { PortData } from "../../utils/types";

export interface DefaultNodeProps extends React.HTMLAttributes<HTMLElement> {
  ports?: { inputs: number; outputs: number };
  onPortPointerDown?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerOver?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerLeave?: PointerEventHandler<HTMLButtonElement> | undefined;
  outputPortRef?: Ref<HTMLButtonElement>;
  inputPortRef?: Ref<HTMLButtonElement>;
}

export interface OutputNodeProps
  extends Omit<DefaultNodeProps, "ports" | "outputPortRef"> {
  ports?: number;
}

export interface InputNodeProps
  extends Omit<DefaultNodeProps, "ports" | "inputPortRef"> {
  ports?: number;
}

export interface NodeProps extends HTMLAttributes<HTMLElement> {
  id: string;
  type: "input" | "output" | "default" | string;
  position: { x: number; y: number };
  ports?: PortData[];
  onPortPointerDown?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerOver?: PointerEventHandler<HTMLButtonElement> | undefined;
  onPortPointerLeave?: PointerEventHandler<HTMLButtonElement> | undefined;
}
