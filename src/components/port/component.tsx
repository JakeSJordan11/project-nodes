import { useEffect, useRef, type PointerEvent } from 'react'
import { useGraph } from '../graph/context/component'
import styles from './styles.module.css'
import type { PortProps } from './types'

export function Port({ id, value, nodeId }: PortProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { dispatch } = useGraph()

  useEffect(() => {
    dispatch({
      type: 'port_value_change',
      payload: { value: value, id: id, nodeId: nodeId },
    })
  }, [value, id, nodeId, dispatch])

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
