import styles from '@/styles/port.module.css'
import { PortProps, PortVariant } from '@/types/port'

export function Port({
  id,
  value,
  variant,
  onPortPointerUp,
  onPortPointerDown,
}: PortProps) {
  switch (variant) {
    case PortVariant.Output:
      return (
        <button
          id={id}
          value={value}
          className={styles.port}
          onPointerDown={(event) =>
            onPortPointerDown ? onPortPointerDown(event, id) : null
          }
        />
      )
    case PortVariant.Input:
      return (
        <button
          id={id}
          value={value}
          className={styles.port}
          onPointerUp={(event) =>
            onPortPointerUp ? onPortPointerUp(event, id) : null
          }
        />
      )
  }
}
