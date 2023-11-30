import { ContextMenu } from '@/components/graph.menu'
import { Stream } from '@/components/stream'
import { useGraph } from '@/hooks/graphs.context'
import styles from '@/styles/graph.module.css'
import { PointerEvent } from 'react'
import { Node } from './node'

export default function Graph() {
  const { state, dispatch } = useGraph()

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_pointer_move', payload: { event: event } })
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_pointer_up', payload: { event: event } })
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_pointer_leave', payload: { event: event } })
  }

  function handleContextMenu(event: PointerEvent<HTMLDivElement>) {
    dispatch({ type: 'graph_menu_show', payload: { event: event } })
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={handleContextMenu}
    >
      {state.nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      <svg className={styles.svg}>
        {state.streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
      {state.ContextMenu.hidden ? null : <ContextMenu />}
    </main>
  )
}
