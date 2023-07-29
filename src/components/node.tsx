import { useNodesDispatch } from '@/hooks/nodes.context'
import styles from '@/styles/node.module.css'
import { NodeVariant, type NodeProps } from '@/types/node'

export default function Node({ ...node }: NodeProps) {
  const dispatch = useNodesDispatch()
  function handleChange() {
    dispatch
  }
  return (
    <article
      className={styles.node}
      style={{ top: node.position.y, left: node.position.x }}
      onPointerUp={() => dispatch}
      onPointerDown={() => dispatch}
    >
      <div className={styles.inputs}></div>
      <output className={styles.value}>{node.value}</output>
      {node.variant === NodeVariant.Number ? (
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={node.value || 0}
          onPointerDown={(event) => event.stopPropagation()}
          onChange={handleChange}
        />
      ) : node.variant === NodeVariant.Operator ? (
        <select className={styles.selector}>
          <option value='addition'>Addition</option>
          <option value='subtraction'>Subtraction</option>
          <option value='multiplication'>Multiplication</option>
          <option value='division'>Division</option>
        </select>
      ) : null}
      <div className={styles.outputs}></div>
    </article>
  )
}
