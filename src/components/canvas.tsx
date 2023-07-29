import CanvasContextMenu from '@/components/canvas.context.menu'
import Node from '@/components/node'
import Stream from '@/components/stream'
import { useNodes, useNodesDispatch } from '@/hooks/nodes.context'
import { useStreams } from '@/hooks/streams.context'
import styles from '@/styles/canvas.module.css'
import { NodeActionType, NodeVariant } from '@/types/node'

export default function Canvas() {
  const nodes = useNodes()
  const streams = useStreams()
  const nodesDispatch = useNodesDispatch()
  return (
    <main className={styles.main}>
      {nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      {streams.length > 0 ? (
        <svg className={styles.svg}>
          {streams.map((stream) => (
            <Stream key={stream.id} {...stream} />
          ))}
        </svg>
      ) : null}
      <CanvasContextMenu
        contextMenuPosition={{ x: 100, y: 100 }}
        onNumberNodeClick={() => {
          nodesDispatch({
            type: NodeActionType.CreateNode,
            payload: NodeVariant.Number,
          })
        }}
        onOperatorNodeClick={() => {
          nodesDispatch({
            type: NodeActionType.CreateNode,
            payload: NodeVariant.Operator,
          })
        }}
      />
    </main>
  )
}
