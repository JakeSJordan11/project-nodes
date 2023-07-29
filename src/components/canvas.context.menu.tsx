import styles from '@/styles/canvas.context.menu.module.css'
import { NodeVariant } from '@/types/node'
import type { MouseEventHandler } from 'react'

export default function CanvasContextMenu({
  onCanvasContextMenuItemCLick,
  contextMenuPosition,
}: {
  onCanvasContextMenuItemCLick: MouseEventHandler<HTMLButtonElement>
  contextMenuPosition: { x: number; y: number }
}) {
  return (
    <div
      className={styles.menuContainer}
      style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
    >
      <button
        className={styles.item}
        value={NodeVariant.Number}
        onClick={onCanvasContextMenuItemCLick}
      >
        Number Node
      </button>

      <button
        className={styles.item}
        value={NodeVariant.Operator}
        onClick={onCanvasContextMenuItemCLick}
      >
        Operator Node
      </button>
    </div>
  )
}
