import { Port } from '@/components/port'
import { useGraph } from '@/hooks/graphs.context'
import styles from '@/styles/node.module.css'
import { NodeProps } from '@/types/node'
import { PortKind } from '@/types/port'
import { ChangeEvent, PointerEvent, useEffect, useRef } from 'react'

export function ColorNode({ id, value, position, variant, ports }: NodeProps) {
  const { dispatch } = useGraph()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    dispatch({
      type: 'node_value_change',
      payload: { value: value, id: id },
    })
  }, [value, id, dispatch])

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: 'node_pointer_down',
      payload: { event: event, id: id },
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: 'node_color_change',
      payload: { event: event, id: id },
    })
  }

  function handleContextMenu(event: PointerEvent<HTMLDivElement>) {
    dispatch({
      type: 'node_menu_show',
      payload: { event: event, id },
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 75
    canvas.height = 75
    const context = canvas?.getContext('2d')
    if (!context) return
    context.fillStyle = String(value)
    context.fillRect(0, 0, canvas.width, canvas.height)
  }, [value])

  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
    >
      {ports.filter((port) => port.kind === PortKind.Input).length <
      1 ? null : (
        <div className={styles.inputs}>
          {ports.map((port) =>
            port.kind !== PortKind.Input ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </div>
      )}
      <h1 className={styles.title}>{variant}</h1>
      <output className={styles.value}>
        <canvas ref={canvasRef} />
      </output>
      {ports.filter((port) => port.kind === PortKind.Output).length <
      1 ? null : (
        <div className={styles.outputs}>
          {ports.map((port) =>
            port.kind !== PortKind.Output ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </div>
      )}
      <input
        type='color'
        onChange={handleChange}
        onPointerDown={(event) => event.stopPropagation()}
      />
    </article>
  )
}
