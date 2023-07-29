import styles from '@/styles/canvas.context.menu.module.css'

export default function CanvasContextMenu({
  onNumberNodeClick,
  onOperatorNodeClick,
  contextMenuPosition,
}: {
  onNumberNodeClick: () => void
  onOperatorNodeClick: () => void
  contextMenuPosition: { x: number; y: number }
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
  )
}
