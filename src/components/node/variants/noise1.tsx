'use client'

import { useEffect, useRef } from 'react'
import noise1Shader from './noise1.wgsl'

export function Noise1({ canvasStyle }: { canvasStyle: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    async function main() {
      const adapter = await navigator.gpu?.requestAdapter()
      const hasBGRA8unormStorage = adapter?.features.has('bgra8unorm-storage')
      const device = await adapter?.requestDevice({
        requiredFeatures: hasBGRA8unormStorage
          ? (['bgra8unorm-storage'] as GPUFeatureName[])
          : [],
      })

      if (!device) {
        fail('need a browser that supports WebGPU')
        return
      }

      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('webgpu') as GPUCanvasContext
      const presentationFormat = hasBGRA8unormStorage
        ? navigator.gpu.getPreferredCanvasFormat()
        : 'rgba8unorm'
      context.configure({
        device,
        format: presentationFormat,
        usage:
          GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
      })

      const module = device.createShaderModule({
        label: 'noise1',
        code: noise1Shader.replace(
          /\$\{presentationFormat\}/g,
          presentationFormat,
        ),
      })

      const pipeline = device.createComputePipeline({
        label: 'noise1',
        layout: 'auto',
        compute: {
          module,
        },
      })

      function render() {
        if (!device || !presentationFormat) {
          console.error('WebGPU device or format not available.')
          return
        }
        if (!canvas) return

        const texture = context.getCurrentTexture()

        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: texture.createView() }],
        })

        const encoder = device.createCommandEncoder({ label: 'our encoder' })
        const pass = encoder.beginComputePass()
        pass.setPipeline(pipeline)
        pass.setBindGroup(0, bindGroup)
        pass.dispatchWorkgroups(texture.width, texture.height)
        pass.end()

        const commandBuffer = encoder.finish()
        device.queue.submit([commandBuffer])
      }

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const canvas = entry.target as HTMLCanvasElement
          const width = entry.contentBoxSize[0].inlineSize
          const height = entry.contentBoxSize[0].blockSize
          canvas.width = Math.max(
            1,
            Math.min(width, device.limits.maxTextureDimension2D),
          )
          canvas.height = Math.max(
            1,
            Math.min(height, device.limits.maxTextureDimension2D),
          )

          render()
        }
      })
      observer.observe(canvas)
    }

    function fail(msg: any) {
      alert(msg)
    }

    main()
  }, [])
  return <canvas ref={canvasRef} className={canvasStyle} />
}
