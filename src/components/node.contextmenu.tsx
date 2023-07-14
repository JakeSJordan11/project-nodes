import type { MouseEventHandler } from "react";
import styles from "@/styles/node.contextmenu.module.css";

export function NodeContextMenu({
  onRemoveNodeClick: onRemoveNodeClick,
  nodeContextMenuPosition: nodeContextMenuPosition,
}: {
  onRemoveNodeClick: MouseEventHandler<HTMLButtonElement>;
  nodeContextMenuPosition: { x: number; y: number };
}) {
  return (
    <div
      className={styles.menuContainer}
      style={{
        top: nodeContextMenuPosition.y,
        left: nodeContextMenuPosition.x,
      }}
    >
      <button className={styles.item} onClick={onRemoveNodeClick}>
        Remove
      </button>
    </div>
  );
}
