import Port from '@/components/port'
import styles from '@/styles/node.module.css'
import { NodeVariant, type NodeProps } from '@/types/node'
import { PortVariant } from '@/types/port'
import { Coordinate } from '@/types/utility'

export default function Node({
  onNodePointerDown,
  onNodePointerUp,
  onNodeValueChange,
  onInputPortPointerDown,
  onInputPortPointerUp,
  onOutputPortPointerDown,
  onOutputPortPointerUp,
  ...node
}: NodeProps & {
  onNodePointerDown: (nodeId: string, nodePosition: Coordinate) => void
  onNodePointerUp: (nodeId: string) => void
  onNodeValueChange: (nodeId: string, nodeValue: number) => void
  onInputPortPointerDown: (
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) => void
  onInputPortPointerUp: (
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) => void
  onOutputPortPointerDown: (
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) => void
  onOutputPortPointerUp: (
    nodeId: string,
    portId: string,
    portBounds: DOMRect
  ) => void
}) {
  return (
    <article
      className={styles.node}
      style={{
        top: node.position.y,
        left: node.position.x,
      }}
      onPointerUp={() => onNodePointerUp(node.id)}
      onPointerDown={(event) =>
        onNodePointerDown(node.id, { x: event.clientX, y: event.clientY })
      }
    >
      <div className={styles.inputs}>
        {node.ports.map((port) =>
          port.variant === PortVariant.Input ? (
            <Port
              key={port.id}
              onPortPointerDown={(portId, portBounds) =>
                onInputPortPointerDown(node.id, portId, portBounds)
              }
              onPortPointerUp={(portId, portBounds) =>
                onInputPortPointerUp(node.id, portId, portBounds)
              }
              {...port}
            />
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
          onChange={(event) =>
            onNodeValueChange(node.id, Number(event.target.value))
          }
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
            <Port
              key={port.id}
              onPortPointerDown={(portId, portBounds) =>
                onOutputPortPointerDown(node.id, portId, portBounds)
              }
              onPortPointerUp={(portId, portBounds) =>
                onOutputPortPointerUp(node.id, portId, portBounds)
              }
              {...port}
            />
          ) : null
        )}
      </div>
    </article>
  )
}
