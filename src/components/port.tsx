import { useGraph } from '@/hooks/graphs.context'
import styles from '@/styles/port.module.css'
import { PortProps } from '@/types/port'
import { PointerEvent, useEffect, useRef } from 'react'

export function Port({ id, value, nodeId }: PortProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { dispatch } = useGraph()

  useEffect(() => {
    dispatch({
      type: 'port_value_change',
      payload: { value: value, id: id, nodeId: nodeId },
    })
  }, [value])

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch({
      type: 'port_pointer_down',
      payload: { event: event, id: id, value: value, ref: ref },
    })
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation()
    dispatch({
      type: 'port_pointer_up',
      payload: { event: event, id: id, value: value, ref: ref },
    })
  }

  return (
    <button
      ref={ref}
      className={styles.port}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  )
}
