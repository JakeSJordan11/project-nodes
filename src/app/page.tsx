import styles from './page.module.css'
import { Library } from '../components/library'
import { WebGPUProvider } from '../context/webgpu.context'
import { Graph, GraphProvider } from '../components/graph'
import { Output } from '../components/output'
import { Properties } from '../components/properties'

export default function Home() {
  return (
    <WebGPUProvider>
      <GraphProvider>
        <main className={styles.main}>
          <Graph />
          <Library />
          <Output />
          <Properties />
        </main>
      </GraphProvider>
    </WebGPUProvider>
  )
}
