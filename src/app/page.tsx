'use client'

import { Graph } from '@/components'
import { GraphProvider } from '@/contexts/graph.context'

export default function Appliaction() {
  return (
    <GraphProvider>
      <Graph />
    </GraphProvider>
  )
}
