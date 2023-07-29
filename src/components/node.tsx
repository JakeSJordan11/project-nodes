import { Port } from '@/components/port'
import { useCanvasDispatch } from '@/hooks/canvas.context'
import styles from '@/styles/node.module.css'
import { CanvasActionType } from '@/types/canvas.context'
import type { NodeProps } from '@/types/node'

export function Node({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch()
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: CanvasActionType.CHANGE_VALUE_SLIDER,
      payload: { ...event },
    })
  }
  return (
    <article
      className={styles.node}
      style={{ top: node.position.y, left: node.position.x }}
      onPointerUp={() => dispatch({ type: CanvasActionType.DROP_SELECTION })}
      onPointerDown={(event) =>
        dispatch({ type: CanvasActionType.SELECT_NODE, payload: { ...event } })
      }
    >
      <div className={styles.inputs}>
        {node.inputs &&
          node.inputs.map((input) => <Port key={input.id} {...input} />)}
      </div>
      <output className={styles.value}>{node.value}</output>
      {node.type === 'number' ? (
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={node.value || 0}
          onPointerDown={(event) => event.stopPropagation()}
          onChange={handleChange}
        />
      ) : node.type === 'operator' ? (
        <select className={styles.selector}>
          <option value='addition'>Addition</option>
          <option value='subtraction'>Subtraction</option>
          <option value='multiplication'>Multiplication</option>
          <option value='division'>Division</option>
        </select>
      ) : null}
      <div className={styles.outputs}>
        {node.outputs &&
          node.outputs.map((output) => <Port key={output.id} {...output} />)}
      </div>
    </article>
  )
}
