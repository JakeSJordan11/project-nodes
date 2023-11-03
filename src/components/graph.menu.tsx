import { useGraph } from '@/hooks/graphs.context'
import styles from '@/styles/graph.menu.module.css'
import { NodeVariant } from '@/types/node'
import { PointerEvent } from 'react'

export function ContextMenu() {
  const { state, dispatch } = useGraph()

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: 'graph_menu_item_pointer_down',
      payload: { event: event },
    })
  }

  return (
    <menu
      className={styles.menu}
      style={{
        left: state.ContextMenu.position.x,
        top: state.ContextMenu.position.y,
      }}
    >
      <h1 className={styles.title}>Create Menu</h1>
      <div className={styles.container}>
        <h1 className={styles.kind}>Inputs</h1>
        <ul className={styles.category}>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Integer}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Float}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Boolean}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.String}
            </button>
          </li>
        </ul>
        <h1 className={styles.kind}>Operators</h1>
        <ul className={styles.category}>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Addition}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Subtraction}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Multiplication}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Division}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Modulo}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Power}
            </button>
          </li>
        </ul>
        <h1 className={styles.kind}>Outputs</h1>
        <ul className={styles.category}>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Result}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Export}
            </button>
          </li>
        </ul>
      </div>
    </menu>
  )
}
