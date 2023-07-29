'use client'

import Canvas from '@/components/canvas'
import NodeProvider from '@/hooks/nodes.context'
import StreamProvider from '@/hooks/streams.context'

export default function Home() {
  return (
    <NodeProvider>
      <StreamProvider>
        <Canvas />
      </StreamProvider>
    </NodeProvider>
  )
}
