import styles from '@/styles/port.module.css'
import type { PortProps } from '@/types/port'

export default function Port({
  onPortPointerDown,
  onPortPointerUp,
  ...port
}: PortProps & {
  onPortPointerDown: (portId: string, portBounds: DOMRect) => void
  onPortPointerUp: (portId: string, portBounds: DOMRect) => void
}) {
  return (
    <button
      className={styles.port}
      onPointerDown={(event) => (
        event.stopPropagation(),
        onPortPointerDown(port.id, event.currentTarget.getBoundingClientRect())
      )}
      onPointerUp={(event) =>
        onPortPointerUp(port.id, event.currentTarget.getBoundingClientRect())
      }
    />
  )
}
