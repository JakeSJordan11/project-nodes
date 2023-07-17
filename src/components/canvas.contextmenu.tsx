import { MouseEvent } from "react";
import styles from "@/styles/canvas.contextmenu.module.css";

export function CanvasContextMenu({
  onNumberNodeClick,
  onOperatorNodeClick,
  contextMenuPosition,
}: {
  onNumberNodeClick: (event: MouseEvent<HTMLElement>) => void;
  onOperatorNodeClick: (event: MouseEvent<HTMLElement>) => void;
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