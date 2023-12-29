'use client'

import Graph from '../components/graph/component'
import { GraphProvider } from '../components/graph/context/component'
import { NewGraph, NewLibrary } from '../components/new'
import styles from './styles.module.css'

export default function Home() {
  return (
    <GraphProvider>
      {/* <main className={styles.page}> */}
      <NewGraph />
      {/* <article className={styles.output} /> */}
      {/* <article className={styles.properties}>properties</article> */}
      {/* </main> */}
    </GraphProvider>
  )
}
