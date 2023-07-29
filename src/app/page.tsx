'use client'

import { Canvas } from '@/components/canvas'
import { CanvasProvider } from '@/hooks/canvas.context'

export default function Page() {
  return (
    <CanvasProvider>
      <Canvas />
    </CanvasProvider>
  )
}
