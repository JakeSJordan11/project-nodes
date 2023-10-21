import { Port } from '@/components/port'
import styles from '@/styles/node.module.css'
import { NodeProps, NodeVariant } from '@/types/node'
import { PortVariant } from '@/types/port'

export function Node({
  id,
  value,
  variant,
  position,
  inputValue,
  input1Value,
  input2Value,
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
          <h1 className={styles.title}>Int</h1>
          <output className={styles.value} tabIndex={0}>
            {value}
          </output>
          <input
            className={styles.slider}
            type='range'
            min='0'
            max='10'
            value={value}
            onChange={(event) => onNodeValueChange(event, id)}
          />
          <div className={styles.outputs}>
            <Port
              id={`${id}-0`}
              value={value}
              variant={PortVariant.Output}
              onPortPointerDown={(event, id) => onPortPointerDown(event, id)}
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
              id={`${id}-0`}
              value={input1Value}
              variant={PortVariant.Input}
              onPortPointerUp={(event) => onPortPointerUp(event, id)}
            />
            <Port
              id={`${id}-1`}
              value={input2Value}
              variant={PortVariant.Input}
              onPortPointerUp={(event) => onPortPointerUp(event, id)}
            />
          </div>
          <h1 className={styles.title}>Add</h1>
          <output className={styles.value} tabIndex={0}>
            {input1Value + input2Value}
          </output>
          <div className={styles.outputs}>
            <Port
              id={`${id}-2`}
              value={input1Value + input2Value}
              variant={PortVariant.Output}
              onPortPointerDown={(event) => onPortPointerDown(event, id)}
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
              id={`${id}-0`}
              value={inputValue}
              variant={PortVariant.Input}
              onPortPointerUp={(event) => onPortPointerUp(event, id)}
            />
          </div>
          <h1 className={styles.title}>Output</h1>
          <output className={styles.value} tabIndex={0}>
            {inputValue}
          </output>
        </article>
      )
  }
}
