import { MouseEvent, PointerEvent, ReactNode } from "react";
import { GraphMenuState } from "./context.menu";
import { NodeState } from "./node";
import { StreamProps } from "./stream";
import { Id, Value } from "./utils";

export interface GraphState {
    nodes: NodeState[],
    streams: StreamProps[],
    ContextMenu: GraphMenuState,
}

export type GraphAction =
    | {
        type: "graph_pointer_move";
        payload: { event: PointerEvent<HTMLElement> };
    }
    | {
        type: "graph_pointer_up";
        payload: { event: PointerEvent<HTMLElement> };
    }
    | {
        type: "graph_pointer_leave";
        payload: { event: PointerEvent<HTMLElement> };
    }
    | { type: "graph_menu_show"; payload: { event: MouseEvent<HTMLElement> } }
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
            event: PointerEvent<HTMLElement>;
            portId: Id;
            portValue: Value;
            nodeId: Id;
            nodeValue: Value;
        };
    }
    | {
        type: "port_pointer_up";
        payload: {
            event: PointerEvent<HTMLElement>;
            portId: Id;
            portValue: Value;
            nodeId: Id;
            nodeValue: Value;
        };
    }
    | { type: "node_value_change"; payload: { id: Id; value: Value } };

export interface GraphProviderProps {
    children: ReactNode
}