import styles from '@/styles/port.module.css'
import { PortProps } from '@/types/port'

export function Port({ id, onPointerUp, onPointerDown }: PortProps) {
  return (
    <button
      id={id}
      className={styles.port}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    />
  )
}
