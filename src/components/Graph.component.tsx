import { Input, Operator, Output, Stream } from '@/components'
import { NodeVariants } from '@/constants'
import { useGraph } from '@/contexts/graph.context'
import styles from '@/styles/graph.module.css'

export function Graph() {
  const { nodes, streams } = useGraph()
  function handleMainPointerMove() {}
  function handleMainPointerUp() {}
  return (
    <main className={styles.main} onPointerMove={handleMainPointerMove} onPointerUp={handleMainPointerUp}>
      {nodes.map((node) => {
        switch (node.variant) {
          case NodeVariants.Input:
            return <Input {...node} key={node.id} />
          case NodeVariants.Operator:
            return <Operator {...node} key={node.id} />
          case NodeVariants.Output:
            return <Output {...node} key={node.id} />
          default:
            return null
        }
      })}
      <svg className={styles.svg} xmlns='http://www.w3.org/2000/svg'>
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </main>
  )
}
