import Port from '@/components/port'
import { useNodesDispatch } from '@/hooks/nodes.context'
import styles from '@/styles/node.module.css'
import { NodeVariant, type NodeProps } from '@/types/node'
import { PortVariant } from '@/types/port'

export default function Node({ ...node }: NodeProps) {
  const nodesDispatch = useNodesDispatch()

  function handleChange() {
    nodesDispatch
  }
  return (
    <article
      className={styles.node}
      style={{ top: node.position.y, left: node.position.x }}
      onPointerUp={() => nodesDispatch}
      onPointerDown={() => nodesDispatch}
    >
      <div className={styles.inputs}>
        {node.ports.map((port) =>
          port.variant === PortVariant.Input ? (
            <Port key={port.id} {...port} />
          ) : null
        )}
      </div>
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
      <div className={styles.outputs}>
        {node.ports.map((port) =>
          port.variant === PortVariant.Output ? (
            <Port key={port.id} {...port} />
          ) : null
        )}
      </div>
    </article>
  )
}
