import { usePortsDispatch } from '@/hooks/ports.context'
import styles from '@/styles/port.module.css'

export default function Port() {
  const portsDispatch = usePortsDispatch()
  return (
    <button
      className={styles.port}
      onPointerDown={(event) => (event.stopPropagation(), portsDispatch)}
      onPointerUp={() => portsDispatch}
      onPointerEnter={() => portsDispatch}
      onPointerLeave={() => portsDispatch}
      onDoubleClick={() => portsDispatch}
    />
  )
}
