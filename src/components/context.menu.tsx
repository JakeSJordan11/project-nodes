import styles from "@/styles/context.menu.module.css";
import { GraphMenuProps } from "@/types/context.menu";
import { NodeVariant } from "@/types/node";

export function ContextMenu({
  position,
  onItemPointerDown,
}: GraphMenuProps) {
  return (
    <menu className={styles.menu} style={{ left: position.x, top: position.y }}>
      <h1 className={styles.title}>Create Menu</h1>
      <div className={styles.container}>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Integer}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Addition}
        </button>
      </div>
    </menu>
  );
}
