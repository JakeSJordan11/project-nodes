import { Port } from '@/components/port'
import styles from '@/styles/port.module.css'
import type { NodeProps } from '@/types/node'

export function Outputs({ ...node }: NodeProps) {
  return (
    <div className={styles.outputContainer}>
      {node.outputs &&
        node.outputs.map((output) => <Port key={output.id} {...output} />)}
    </div>
  )
}
