import styles from '@/styles/port.module.css'
import { PortProps, PortVariant } from '@/types/port'

export function Port({
  id,
  onPortPointerDown,
  onPortPointerUp,
  variant,
}: PortProps) {
  switch (variant) {
    case PortVariant.Output:
      return (
        <button
          className={styles.port}
          onPointerDown={(event) =>
            onPortPointerDown ? onPortPointerDown(event, id) : null
          }
        />
      )
    case PortVariant.Input:
      return (
        <button
          className={styles.port}
          onPointerUp={(event) =>
            onPortPointerUp ? onPortPointerUp(event, id) : null
          }
        />
      )
  }
}
