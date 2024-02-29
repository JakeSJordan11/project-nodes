import { useEffect, useRef } from 'react'
import styles from '../webgpu.module.css'
import uniforms from './uniforms.wgsl'

type objectInfosType = {
  scale: number
  uniformBuffer: GPUBuffer
  uniformValues: Float32Array
  bindGroup: GPUBindGroup
}

export function Uniforms() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // A random number between [min and max)
    // With 1 argument it will be [0 to min)
    // With no arguments it will be [0 to 1)
    const rand = (min?: number, max?: number) => {
      if (min === undefined) {
        min = 0
        max = 1
      } else if (max === undefined) {
        max = min
        min = 0
      }
      return min + Math.random() * (max - min)
    }

    async function main() {
      const adapter = (await navigator.gpu?.requestAdapter()) as GPUAdapter
      const device = (await adapter?.requestDevice()) as GPUDevice
      if (!device) {
        fail('need a browser that supports WebGPU')
        return
      }

      // Get a WebGPU context from the canvas and configure it
      const canvas = canvasRef.current as HTMLCanvasElement
      const context = canvas.getContext('webgpu') as GPUCanvasContext
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device,
        format: presentationFormat,
      })

      const shaderModule = device.createShaderModule({
        code: uniforms,
      })

      const pipeline = device.createRenderPipeline({
        label: 'multiple uniform buffer',
        layout: 'auto',
        vertex: {
          module: shaderModule,
          entryPoint: 'vs',
        },
        fragment: {
          module: shaderModule,
          entryPoint: 'fs',
          targets: [{ format: presentationFormat }],
        },
      })

      // create 2 buffers for the uniform values
      const staticUniformBufferSize =
        4 * 4 + // color is 4 32bit floats (4bytes each)
        2 * 4 + // offset is 2 32bit floats (4bytes each)
        2 * 4 // padding
      const uniformBufferSize = 2 * 4 // scale is 2 32bit floats (4bytes each)

      // offsets to the various uniform values in float32 indices
      const kColorOffset = 0
      const kOffsetOffset = 4

      const kScaleOffset = 0

      const kNumObjects = 100
      const objectInfos: objectInfosType[] = []

      for (let i = 0; i < kNumObjects; ++i) {
        const staticUniformBuffer = device.createBuffer({
          label: `static uniforms for obj: ${i}`,
          size: staticUniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        // These are only set once so set them now
        {
          const uniformValues = new Float32Array(staticUniformBufferSize / 4)
          uniformValues.set([rand(), rand(), rand(), 1], kColorOffset) // set the color
          uniformValues.set([rand(-0.9, 0.9), rand(-0.9, 0.9)], kOffsetOffset) // set the offset

          // copy these values to the GPU
          device.queue.writeBuffer(staticUniformBuffer, 0, uniformValues)
        }

        // create a typedarray to hold the values for the uniforms in JavaScript
        const uniformValues = new Float32Array(uniformBufferSize / 4)
        const uniformBuffer = device.createBuffer({
          label: `changing uniforms for obj: ${i}`,
          size: uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        const bindGroup = device.createBindGroup({
          label: `bind group for obj: ${i}`,
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: staticUniformBuffer } },
            { binding: 1, resource: { buffer: uniformBuffer } },
          ],
        })

        objectInfos.push({
          scale: rand(0.2, 0.5),
          uniformBuffer,
          uniformValues,
          bindGroup,
        })
      }

      const renderPassDescriptor = {
        label: 'our basic canvas renderPass',
        colorAttachments: [
          {
            view: {} as GPUTextureView,
            clearValue: [0.3, 0.3, 0.3, 1],
            loadOp: 'clear',
            storeOp: 'store',
          } as GPURenderPassColorAttachment,
        ],
      }

      function render() {
        // Get the current texture from the canvas context and
        // set it as the texture to render to.
        renderPassDescriptor.colorAttachments[0].view = context
          .getCurrentTexture()
          .createView()

        const encoder = device.createCommandEncoder()
        const pass = encoder.beginRenderPass(renderPassDescriptor)
        pass.setPipeline(pipeline)

        // Set the uniform values in our JavaScript side Float32Array
        const aspect = canvas.width / canvas.height

        for (const {
          scale,
          bindGroup,
          uniformBuffer,
          uniformValues,
        } of objectInfos) {
          uniformValues.set([scale / aspect, scale], kScaleOffset) // set the scale
          device.queue.writeBuffer(uniformBuffer, 0, uniformValues)

          pass.setBindGroup(0, bindGroup)
          pass.draw(3) // call our vertex shader 3 times
        }
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
          // re-render
          render()
        }
      })
      observer.observe(canvas)
    }

    function fail(msg: string) {
      alert(msg)
    }

    main()
  }, [])

  return <canvas className={styles.canvas} ref={canvasRef} />
}
