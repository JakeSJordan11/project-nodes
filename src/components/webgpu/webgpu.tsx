import { useEffect, useRef } from 'react'
import multiColorTriangle from './multiColorTirangle.wgsl'
import styles from './webgpu.module.css'

export function WebGPU() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function main() {
      const adapter = (await navigator.gpu?.requestAdapter()) as GPUAdapter
      // request a device from the adapter.
      const device = await adapter?.requestDevice()
      if (!device) {
        console.error('need a browser that supports WebGPU')
      }

      // Get a WebGPU context from the canvas and configure it
      const canvas = canvasRef.current as HTMLCanvasElement
      const context = canvas.getContext('webgpu') as GPUCanvasContext
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device,
        format: presentationFormat,
      })

      // create a shader module
      const shaderModule = device.createShaderModule({
        label: 'our hardcoded multicolor triangle shader',
        code: multiColorTriangle,
      })

      // make a render pipeline
      const pipeline = device.createRenderPipeline({
        label: 'our hardcoded red triangle pipeline',
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

      // prepare a GPURenderPassDescriptor
      // which describes which textures we want to draw to
      // and how to use them

      const renderPassDescriptor = {
        label: 'our basic canvas renderPass',
        colorAttachments: [
          {
            view: {} as GPUTextureView,
            clearValue: [0.18, 0.18, 0.18, 1.0],
            loadOp: 'clear',
            storeOp: 'store',
          } as GPURenderPassColorAttachment,
        ],
      }

      // render the triangle
      function render() {
        // Get the current texture from the canvas context and
        // set it as the texture to render to.
        renderPassDescriptor.colorAttachments[0].view = context
          .getCurrentTexture()
          .createView()

        // make a command encoder to start encoding commands
        const encoder = device.createCommandEncoder({
          label: 'our encoder',
        })

        // make a render pass encoder to encode render specific commands
        const pass = encoder.beginRenderPass(renderPassDescriptor)
        pass.setPipeline(pipeline)
        pass.draw(3) // call our vertex shader 3 times
        pass.end()

        const commandBuffer = encoder.finish()
        device.queue.submit([commandBuffer])
      }

      render()
    }

    canvasRef.current && main()
  }, [])

  return <canvas className={styles.canvas} ref={canvasRef} />
}
