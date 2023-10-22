import styles from '@/styles/context.menu.module.css'
import { ContextMenuProps } from '@/types/context.menu'

export function ContextMenu({ position, onItemPointerDown }: ContextMenuProps) {
  return (
    <menu className={styles.menu} style={{ left: position.x, top: position.y }}>
      <h1 className={styles.title}>Create Node Menu</h1>
      <div className={styles.container}>
        <button
          className={styles.button}
          value='IntegerNode'
          onPointerDown={onItemPointerDown}
        >
          Integer Node
        </button>
        <button
          className={styles.button}
          value='AdditionNode'
          onPointerDown={onItemPointerDown}
        >
          Addition Node
        </button>
        <button
          className={styles.button}
          value='OutputNode'
          onPointerDown={onItemPointerDown}
        >
          Output Node
        </button>
      </div>
    </menu>
  )
}
