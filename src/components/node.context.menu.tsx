import type { MouseEventHandler } from "react";
import styles from "./nodeContextMenu.module.css";

export function NodeMenu({
  onRemoveNodeClick: onRemoveNodeClick,
  nodeMenuPosition: nodeMenuPosition,
}: {
  onRemoveNodeClick: MouseEventHandler<HTMLButtonElement>;
  nodeMenuPosition: { x: number; y: number };
}) {
  return (
    <div
      className={styles.menuContainer}
      style={{ top: nodeMenuPosition.y, left: nodeMenuPosition.x }}
    >
      <button className={styles.item} onClick={onRemoveNodeClick}>
        Remove
      </button>
    </div>
  );
}
