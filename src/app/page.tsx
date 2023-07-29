'use client'

import Canvas from '@/components/canvas'
import NodeProvider from '@/hooks/nodes.context'
import PortProvider from '@/hooks/ports.context'
import StreamProvider from '@/hooks/streams.context'

export default function Home() {
  return (
    <NodeProvider>
      <PortProvider>
        <StreamProvider>
          <Canvas />
        </StreamProvider>
      </PortProvider>
    </NodeProvider>
  )
}
