import styles from '@/styles/stream.module.css'
import type { StreamProps } from '@/types/stream'

export function Stream({ m, l }: StreamProps) {
  return <path className={styles.path} d={m + l} />
}
