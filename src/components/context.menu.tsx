import styles from '@/styles/context.menu.module.css'
import { ContextMenuProps } from '@/types/context.menu'
import { NodeKind, NodeVariant } from '@/types/node'

export function ContextMenu({ position, onItemPointerDown }: ContextMenuProps) {
  return (
    <menu className={styles.menu} style={{ left: position.x, top: position.y }}>
      <h1 className={styles.title}>Create Menu</h1>
      <div className={styles.container}>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Integer}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Float}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Boolean}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.String}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Addition}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Subtraction}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Multiplication}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Division}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Modulo}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Power}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Result}
        </button>
        <button className={styles.item} onPointerDown={onItemPointerDown}>
          {NodeVariant.Export}
        </button>
      </div>
    </menu>
  )
}
