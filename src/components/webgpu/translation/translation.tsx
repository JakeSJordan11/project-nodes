import { useEffect, useRef } from 'react'
import styles from '../webgpu.module.css'
import translation from './translation.wgsl'

export function Translation(valueX = 0, valueY = 0) {
  const translationRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    function createFVertices() {
      const vertexData = new Float32Array([
        // left column
        0, 0, 30, 0, 0, 150, 30, 150,

        // top rung
        30, 0, 100, 0, 30, 30, 100, 30,

        // middle rung
        30, 60, 70, 60, 30, 90, 70, 90,
      ])

      const indexData = new Uint32Array([
        0,
        1,
        2,
        2,
        1,
        3, // left column
        4,
        5,
        6,
        6,
        5,
        7, // top run
        8,
        9,
        10,
        10,
        9,
        11, // middle run
      ])

      return {
        vertexData,
        indexData,
        numVertices: indexData.length,
      }
    }

    async function main() {
      const adapter = (await navigator.gpu?.requestAdapter()) as GPUAdapter
      // request a device from the adapter.
      const device = await adapter?.requestDevice()
      if (!device) {
        console.error('need a browser that supports WebGPU')
      }

      // Get a WebGPU context from the canvas and configure it
      const canvas = translationRef.current as HTMLCanvasElement
      if (!canvas) {
        fail('canvasRef is not set')
        return
      }
      const context = canvas.getContext('webgpu') as GPUCanvasContext
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      })

      const shaderModule = device.createShaderModule({
        code: translation,
      })

      const pipeline = device.createRenderPipeline({
        label: 'just 2d position',
        layout: 'auto',
        vertex: {
          module: shaderModule,
          entryPoint: 'vs',
          buffers: [
            {
              arrayStride: 2 * 4, // (2) floats, 4 bytes each
              attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position
              ],
            },
          ] as GPUVertexBufferLayout[],
        },
        fragment: {
          module: shaderModule,
          entryPoint: 'fs',
          targets: [{ format: presentationFormat }],
        },
      })

      // color, resolution, padding
      const uniformBufferSize = (4 + 2) * 4 + 8
      const uniformBuffer = device.createBuffer({
        label: 'uniforms',
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      })

      const uniformValues = new Float32Array(uniformBufferSize / 4)

      // offsets to the various uniform values in float32 indices
      const kColorOffset = 0
      const kResolutionOffset = 4
      const kTranslationOffset = 6

      const colorValue = uniformValues.subarray(kColorOffset, kColorOffset + 4)
      const resolutionValue = uniformValues.subarray(
        kResolutionOffset,
        kResolutionOffset + 2
      )
      const translationValue = uniformValues.subarray(
        kTranslationOffset,
        kTranslationOffset + 2
      )

      // The color will not change so let's set it once at init time
      colorValue.set([Math.random(), Math.random(), Math.random(), 1])

      const { vertexData, indexData, numVertices } = createFVertices()
      const vertexBuffer = device.createBuffer({
        label: 'vertex buffer vertices',
        size: vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      })
      device.queue.writeBuffer(vertexBuffer, 0, vertexData)
      const indexBuffer = device.createBuffer({
        label: 'index buffer',
        size: indexData.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      })
      device.queue.writeBuffer(indexBuffer, 0, indexData)

      const bindGroup = device.createBindGroup({
        label: 'bind group for object',
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      })

      const renderPassDescriptor = {
        label: 'our basic canvas renderPass',
        colorAttachments: [
          {
            // view: <- to be filled out when we render
            loadOp: 'clear',
            storeOp: 'store',
          },
        ] as GPURenderPassColorAttachment[],
      }

      const settings = {
        translation: [valueX, valueY],
      }

      // const gui = new GUI()
      // gui.onChange(render)
      // gui.add(settings.translation, '0', 0, 1000).name('translation.x')
      // gui.add(settings.translation, '1', 0, 1000).name('translation.y')

      function render() {
        // Get the current texture from the canvas context and
        // set it as the texture to render to.
        renderPassDescriptor.colorAttachments[0].view = context
          .getCurrentTexture()
          .createView()

        const encoder = device.createCommandEncoder()
        const pass = encoder.beginRenderPass(renderPassDescriptor)
        pass.setPipeline(pipeline)
        pass.setVertexBuffer(0, vertexBuffer)
        pass.setIndexBuffer(indexBuffer, 'uint32')

        // Set the uniform values in our JavaScript side Float32Array
        resolutionValue.set([canvas.width, canvas.height])
        translationValue.set(settings.translation)

        // upload the uniform values to the uniform buffer
        device.queue.writeBuffer(uniformBuffer, 0, uniformValues)

        pass.setBindGroup(0, bindGroup)
        pass.drawIndexed(numVertices)

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
    console.log(settings.translation)
  }, [])

  return <canvas className={styles.canvas} ref={translationRef} />
}
