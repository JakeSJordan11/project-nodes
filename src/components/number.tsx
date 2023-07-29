import { useCanvasDispatch } from '@/hooks/canvas.context'
import styles from '@/styles/number.module.css'
import { CanvasActionType } from '@/types/canvas.context'
import type { NodeProps } from '@/types/node'

export function Number({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: CanvasActionType.CHANGE_VALUE_SLIDER,
      payload: { ...event },
    })
  }
  return (
    <>
      <output className={styles.contentContainer}>{node.value || 0}</output>
      <input
        className={styles.slider}
        type='range'
        min='0'
        max='10'
        value={node.value || 0}
        onPointerDown={(event) => event.stopPropagation()}
        onChange={handleChange}
      />
    </>
  )
}
