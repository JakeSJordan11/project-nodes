'use client'

import Canvas from '@/components/canvas'
import CanvasProvider from '@/hooks/canvas.context'

export default function Home() {
  return (
    <CanvasProvider>
      <Canvas />
    </CanvasProvider>
  )
}
