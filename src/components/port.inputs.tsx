import { Port } from '@/components/port'
import styles from '@/styles/port.module.css'
import type { NodeProps } from '@/types/node'

export function Inputs({ ...node }: NodeProps) {
  return (
    <div className={styles.inputContainer}>
      {node.inputs &&
        node.inputs.map((input) => <Port key={input.id} {...input} />)}
    </div>
  )
}
