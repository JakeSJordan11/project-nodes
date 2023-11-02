import styles from "@/styles/context.menu.module.css";
import { GraphMenuProps } from "@/types/context.menu";
import { NodeVariant } from "@/types/node";
import { PointerEvent } from "react";
import { useGraph } from "src/hooks/graphs.context";

export function ContextMenu() {
  const { state, dispatch } = useGraph();

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: "graph_menu_item_pointer_down",
      payload: { event: event },
    });
  }

  return (
    <menu
      className={styles.menu}
      style={{
        left: state.ContextMenu.position.x,
        top: state.ContextMenu.position.y,
      }}
    >
      <h1 className={styles.title}>Create Menu</h1>
      <div className={styles.container}>
        <button className={styles.item} onPointerDown={handlePointerDown}>
          {NodeVariant.Integer}
        </button>
        <button className={styles.item} onPointerDown={handlePointerDown}>
          {NodeVariant.Addition}
        </button>
      </div>
    </menu>
  );
}
