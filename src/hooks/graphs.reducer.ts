import { GraphAction, GraphState } from "@/types/graph";

export const initialState: GraphState = {
  nodes: [],
  streams: [],
  ContextMenu: { position: { x: 0, y: 0 }, hidden: true },
};

export function graphsReducer(
  state: GraphState,
  action: GraphAction
): GraphState {
  switch (action.type) {
    case "graph_pointer_move": {
      return initialState;
    }
    case "graph_pointer_up": {
      return initialState;
    }
    case "graph_pointer_leave": {
      return initialState;
    }
    case "graph_menu_show": {
      return initialState;
    }
    case "graph_menu_item_pointer_down": {
      return initialState;
    }
    case "node_pointer_down": {
      return initialState;
    }
    case "port_pointer_down": {
      return initialState;
    }
    case "port_pointer_up": {
      return initialState;
    }
    case "node_value_change": {
      return initialState;
    }
    default:
      throw new Error("Unknown action");
  }
}
