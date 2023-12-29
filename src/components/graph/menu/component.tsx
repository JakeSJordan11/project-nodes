import type { PointerEvent } from 'react'
import { NodeVariant } from '../../node/enums'
import { useGraph } from '../context/component'
import styles from './styles.module.css'

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
        left: state.ContextMenus.graph.position.x,
        top: state.ContextMenus.graph.position.y,
      }}
    >
      <h1 className={styles.title}>Create Menu</h1>
      <div className={styles.container}>
        <h2 className={styles.type}>Numbers</h2>
        <h3 className={styles.kind}>Inputs</h3>
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
        <h3 className={styles.kind}>Operators</h3>
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
              {NodeVariant.Exponentiation}
            </button>
          </li>
        </ul>
        <h3 className={styles.kind}>Outputs</h3>
        <ul className={styles.category}>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Result}
            </button>
          </li>
        </ul>
        <h2 className={styles.type}>Colors</h2>
        <h3 className={styles.kind}>Inputs</h3>
        <ul className={styles.category}>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.WebGpu}
            </button>
          </li>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Color}
            </button>
          </li>
        </ul>
        <h3 className={styles.kind}>Operators</h3>
        <ul className={styles.category}>
          <li>
            <button className={styles.item} onPointerDown={handlePointerDown}>
              {NodeVariant.Blend}
            </button>
          </li>
        </ul>
      </div>
    </menu>
  )
}
