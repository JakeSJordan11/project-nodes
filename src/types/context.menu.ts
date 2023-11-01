import { Coordinate } from "@/types/utils";
import { PointerEventHandler } from "react";

export interface GraphMenuState {
  position: Coordinate;
  hidden: boolean;
}

export interface GraphMenuProps extends GraphMenuState {
  onItemPointerDown?: PointerEventHandler<HTMLButtonElement>;
}
