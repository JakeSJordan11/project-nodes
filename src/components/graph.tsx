import { ContextMenu } from "@/components/context.menu";
import { Node } from "@/components/node";
import { Stream } from "@/components/stream";
import styles from "@/styles/page.module.css";
import { Value } from "@/types/utils";
import { ChangeEvent, MouseEvent, PointerEvent } from "react";
import { useGraph } from "src/hooks/graphs.context";

export default function Graph() {
  const { state, dispatch } = useGraph();

  function handleGraphPointerMove(event: PointerEvent<HTMLElement>) {
    dispatch({ type: "graph_pointer_move", payload: { event: event } });
  }

  function handleGraphPointerUp(event: PointerEvent<HTMLElement>) {
    dispatch({ type: "graph_pointer_up", payload: { event: event } });
  }

  function handleGraphPointerLeave(event: PointerEvent<HTMLElement>) {
    dispatch({ type: "graph_pointer_leave", payload: { event: event } });
  }

  function handleGraphMenu(event: MouseEvent<HTMLElement>) {
    dispatch({ type: "graph_menu_show", payload: { event: event } });
  }

  function handleGraphMenuItemPointerDown(event: PointerEvent<HTMLElement>) {
    dispatch({
      type: "graph_menu_item_pointer_down",
      payload: { event: event },
    });
  }

  function handleNodePointerDown(event: PointerEvent<HTMLElement>, id: string) {
    dispatch({ type: "node_pointer_down", payload: { event: event, id: id } });
  }

  function handlePortPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    portId: string,
    portValue: Value,
    nodeId: string,
    nodeValue: Value
  ) {
    dispatch({
      type: "port_pointer_down",
      payload: {
        event: event,
        portId: portId,
        portValue: portValue,
        nodeId: nodeId,
        nodeValue: nodeValue,
      },
    });
  }

  function handlePortPointerUp(
    event: PointerEvent<HTMLButtonElement>,
    portId: string,
    portValue: Value,
    nodeId: string,
    nodeValue: Value
  ) {
    dispatch({
      type: "port_pointer_up",
      payload: {
        event: event,
        portId: portId,
        portValue: portValue,
        nodeId: nodeId,
        nodeValue: nodeValue,
      },
    });
  }

  function handleValueChange(event: ChangeEvent<HTMLInputElement>, id: string) {
    dispatch({
      type: "node_value_change",
      payload: {
        id: id,
        value: Number(event.target.value),
      },
    });
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleGraphPointerMove}
      onPointerUp={handleGraphPointerUp}
      onPointerLeave={handleGraphPointerLeave}
      onContextMenu={handleGraphMenu}
    >
      {state.ContextMenu.hidden ? null : (
        <ContextMenu
          {...state.ContextMenu}
          position={state.ContextMenu.position}
          onItemPointerDown={handleGraphMenuItemPointerDown}
        />
      )}
      {state.nodes.map((node) => (
        <Node
          {...node}
          key={node.id}
          onNodePointerDown={handleNodePointerDown}
          onPortPointerDown={handlePortPointerDown}
          onPortPointerUp={handlePortPointerUp}
          onValueChange={handleValueChange}
        />
      ))}
      {state.streams.length > 0 ? null : (
        <svg className={styles.svg}>
          {state.streams.map((stream) => (
            <Stream {...stream} key={stream.id} />
          ))}
        </svg>
      )}
    </main>
  );
}
