import { Content } from '@/components/content'
import { useCanvasDispatch } from '@/hooks/canvas.context'
import styles from '@/styles/node.module.css'
import { CanvasActionType } from '@/types/canvas.context'
import type { NodeProps } from '@/types/node'

export function Node({ ...node }: NodeProps) {
  const dispatch = useCanvasDispatch()
  return (
    <article
      id={node.id}
      className={styles.node}
      style={{ top: node.position.y, left: node.position.x }}
      onPointerUp={() => dispatch({ type: CanvasActionType.DROP_SELECTION })}
      onPointerDown={(event) =>
        dispatch({ type: CanvasActionType.SELECT_NODE, payload: { ...event } })
      }
    >
      <Content {...node} />
    </article>
  )
}
