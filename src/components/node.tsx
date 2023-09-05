import { Port } from '@/components/port'
import styles from '@/styles/node.module.css'
import { NodeProps, NodeVariant, Operator } from '@/types/node'
import { PortVariant } from '@/types/port'

export function Node({
  id,
  value,
  variant,
  position,
  operator,
  onOperatorChange,
  onNodeValueChange,
  onPortPointerDown,
  onPortPointerUp,
}: NodeProps) {
  switch (variant) {
    case NodeVariant.Input:
      return (
        <article
          className={styles.node}
          style={{ left: position.x, top: position.y }}
        >
          <output className={styles.value} tabIndex={0}>
            {value}
          </output>
          <input
            className={styles.slider}
            type='range'
            min='0'
            max='10'
            value={value}
            onChange={(event) =>
              onNodeValueChange ? onNodeValueChange(event, id) : null
            }
          />
          <div className={styles.outputs}>
            <Port
              id={`${id}-output-0}`}
              value={value}
              variant={PortVariant.Output}
              onPortPointerDown={(event, id) =>
                onPortPointerDown ? onPortPointerDown(event, id) : null
              }
            />
          </div>
        </article>
      )
    case NodeVariant.Operator:
      return (
        <article
          className={styles.node}
          style={{ left: position.x, top: position.y }}
        >
          <div className={styles.inputs}>
            <Port
              id={`${id}-input-0`}
              value={value}
              variant={PortVariant.Input}
              onPortPointerUp={(event, id) =>
                onPortPointerUp ? onPortPointerUp(event, id) : null
              }
            />
            <Port
              id={`${id}-input-1`}
              value={value}
              variant={PortVariant.Input}
              onPortPointerUp={(event, id) =>
                onPortPointerUp ? onPortPointerUp(event, id) : null
              }
            />
          </div>
          <output className={styles.value} tabIndex={0}>
            {value}
          </output>
          <select
            className={styles.selector}
            value={operator}
            onChange={onOperatorChange}
          >
            <option value={Operator.Addition}>Addition</option>
            <option value={Operator.Subtraction}>Subtraction</option>
            <option value={Operator.Multiplication}>Multiplication</option>
            <option value={Operator.Division}>Division</option>
            <option value={Operator.Exponentiation}>Exponentiation</option>
            <option value={Operator.Modulo}>Modulo</option>
          </select>
          <div className={styles.outputs}>
            <Port
              id={`${id}-output-0`}
              value={value}
              variant={PortVariant.Output}
              onPortPointerDown={(event, id) =>
                onPortPointerDown ? onPortPointerDown(event, id) : null
              }
            />
          </div>
        </article>
      )
    case NodeVariant.Output:
      return (
        <article
          className={styles.node}
          style={{ left: position.x, top: position.y }}
        >
          <div className={styles.inputs}>
            <Port
              id={`${id}-input-0`}
              value={value}
              variant={PortVariant.Input}
              onPortPointerUp={(event, id) =>
                onPortPointerUp ? onPortPointerUp(event, id) : null
              }
            />
          </div>
          <output className={styles.value} tabIndex={0}>
            {value}
          </output>
        </article>
      )
  }
}
