import { useCanvas } from '../../../hooks'
import { Node } from './node.component'

export function Nodes() {
  const { nodes } = useCanvas()
  return (
    <>
      {nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
    </>
  )
}

//NOTE: Maybe make this compose all the different node types...
