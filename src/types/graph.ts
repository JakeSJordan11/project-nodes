import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { GraphMenuState } from "./context.menu";
import { NodeProps } from "./node";
import { StreamProps } from "./stream";
import { Id, Value } from "./utils";

export interface GraphProviderProps {
  children: ReactNode;
}

export interface GraphState {
  nodes: NodeProps[];
  streams: StreamProps[];
  ContextMenu: GraphMenuState;
}

export type GraphAction =
  | {
      type: "graph_pointer_down";
      payload: { event: PointerEvent<HTMLElement> };
    }
  | {
      type: "graph_pointer_move";
      payload: { event: PointerEvent<HTMLElement> };
    }
  | { type: "graph_pointer_up"; payload: { event: PointerEvent<HTMLElement> } }
  | {
      type: "graph_pointer_leave";
      payload: { event: PointerEvent<HTMLElement> };
    }
  | {
      type: "graph_menu_show";
      payload: { event: MouseEvent<HTMLElement> };
    }
  | {
      type: "graph_menu_item_pointer_down";
      payload: { event: PointerEvent<HTMLElement> };
    }
  | {
      type: "node_pointer_down";
      payload: { event: PointerEvent<HTMLElement>; id: Id };
    }
  | {
      type: "port_pointer_down";
      payload: {
        event: PointerEvent<HTMLButtonElement>;
        id: Id;
        value: Value;
      };
    }
  | {
      type: "port_pointer_up";
      payload: {
        event: PointerEvent<HTMLButtonElement>;
        id: Id;
        value: Value;
      };
    }
  | {
      type: "node_slider_change";
      payload: { event: ChangeEvent<HTMLInputElement>; id: Id };
    };
