import { useGraph } from '@/contexts/graph.povider'
import styles from '@/styles/node.menu.module.css'
import type { PointerEvent } from 'react'

export function NodeMenu() {
  const { state, dispatch } = useGraph()

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: 'node_menu_item_pointer_down',
      payload: { event: event },
    })
  }

  return (
    <menu
      className={styles.menu}
      style={{
        left: state.ContextMenus.node.position.x,
        top: state.ContextMenus.node.position.y,
      }}
    >
      <h1 className={styles.title}>Node Menu</h1>
      <div className={styles.container}>
        <h1 className={styles.kind}>Actions</h1>
        <ul className={styles.category}>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              copy value
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              delete node
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              disconnect node
            </button>
          </li>
        </ul>
      </div>
    </menu>
  )
}
