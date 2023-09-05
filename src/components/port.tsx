import styles from '@/styles/port.module.css'
import { PortProps, PortVariant } from '@/types/port'

export function Port({
  onPortPointerDown,
  onPortPointerUp,
  variant,
}: PortProps) {
  switch (variant) {
    case PortVariant.Output:
      return (
        <button className={styles.port} onPointerDown={onPortPointerDown} />
      )
    case PortVariant.Input:
      return <button className={styles.port} onPointerUp={onPortPointerUp} />
  }
}
