import styles from '@/styles/node.context.menu.module.css'
import type { MouseEventHandler } from 'react'

export function NodeContextMenu({
  onRemoveNodeClick: onRemoveNodeClick,
  nodeMenuPosition: nodeMenuPosition,
}: {
  onRemoveNodeClick: MouseEventHandler<HTMLButtonElement>
  nodeMenuPosition: { x: number; y: number }
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
  )
}
