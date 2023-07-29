import styles from '@/styles/stream.module.css'
import type { StreamProps } from '@/types/stream'

export function Stream({ ...stream }: StreamProps) {
  return (
    <path
      className={styles.path}
      d={stream.m && stream.l && stream.m + stream.l}
    />
  )
}
