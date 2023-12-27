import Graph from '../components/graph/component'
import { GraphProvider } from '../components/graph/context/component'

export default function Home() {
  return (
    <GraphProvider>
      <Graph />
    </GraphProvider>
  )
}
