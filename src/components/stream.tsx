import styles from '@/styles/stream.module.css'
import type { StreamProps } from '@/types/stream'

export default function Stream({ from, to }: StreamProps) {
  return <path className={styles.path} d={from + to} />
}
