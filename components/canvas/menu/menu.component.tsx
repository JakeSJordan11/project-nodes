import type { MouseEventHandler } from "react";
import styles from "./menu.module.css";

export function Menu({
  onNumberNodeClick,
  onOperatorNodeClick,
  contextMenuPosition,
}: {
  onNumberNodeClick: MouseEventHandler<HTMLButtonElement>;
  onOperatorNodeClick: MouseEventHandler<HTMLButtonElement>;
  contextMenuPosition: { x: number; y: number };
}) {
  return (
    <div
      className={styles.menuContainer}
      style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
    >
      <button className={styles.item} onClick={onNumberNodeClick}>
        Number Node
      </button>

      <button className={styles.item} onClick={onOperatorNodeClick}>
        Operator Node
      </button>
    </div>
  );
}
