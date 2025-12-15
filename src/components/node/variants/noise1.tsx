'use client'

import { useEffect, useRef } from 'react'

export function Noise1({ canvasStyle }: { canvasStyle: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    async function main() {
      const adapter = await navigator.gpu?.requestAdapter()
      const hasBGRA8unormStorage = adapter?.features.has('bgra8unorm-storage')
      const device = await adapter?.requestDevice({
        requiredFeatures: hasBGRA8unormStorage
          ? (['bgra8unorm-storage'] as Iterable<GPUFeatureName>)
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
        code: `@group(0) @binding(0) var tex : texture_storage_2d<${presentationFormat}, write>;

        @compute @workgroup_size(1)
        fn cs(@builtin(global_invocation_id) id : vec3u) {
          let size = textureDimensions(tex);
          if (id.x >= size.x || id.y >= size.y) {
            return;
          }

          // cheap hash
          let seed = id.x * 1973u + id.y * 9277u + 89173u;
          let n = f32((seed << 13u) ^ seed) * 0.0000001;
          let v = fract(sin(n) * 43758.5453);

          textureStore(tex, id.xy, vec4f(v, v, v, 1.0));
        }`,
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
            Math.min(width, device.limits.maxTextureDimension2D)
          )
          canvas.height = Math.max(
            1,
            Math.min(height, device.limits.maxTextureDimension2D)
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
