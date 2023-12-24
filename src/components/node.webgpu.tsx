import { Port } from '@/components/port'
import { useGraph } from '@/hooks/graphs.context'
import styles from '@/styles/node.module.css'
import { NodeProps } from '@/types/node'
import { PortKind } from '@/types/port'
import { PointerEvent, use, useEffect, useRef } from 'react'

export function WebgpuNode({ id, value, position, variant, ports }: NodeProps) {
  const { dispatch } = useGraph()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function main() {
      const adapter = await navigator.gpu?.requestAdapter()
      // request a device from the adapter.
      const device = await adapter?.requestDevice()
      if (!device) {
        fail('need a browser that supports WebGPU')
        return
      }

      // Get a WebGPU context from the canvas and configure it
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('webgpu')
      if (!context) return
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device,
        format: presentationFormat,
      })

      // create a shader module
      const module = device.createShaderModule({
        label: 'our hardcoded red triangle shaders',
        code: `
    @vertex fn vs(
      @builtin(vertex_index) vertexIndex : u32
    ) -> @builtin(position) vec4f {
      let pos = array(
        vec2f( 0.0,  0.5),  // top center
        vec2f(-0.5, -0.5),  // bottom left
        vec2f( 0.5, -0.5)   // bottom right
      );

      return vec4f(pos[vertexIndex], 0.0, 1.0);
    }

    @fragment fn fs() -> @location(0) vec4f {
      return vec4f(1.0, 0.0, 0.0, 1.0);
    }
  `,
      })

      // make a render pipeline
      const pipeline = device.createRenderPipeline({
        label: 'our hardcoded red triangle pipeline',
        layout: 'auto',
        vertex: {
          module,
          entryPoint: 'vs',
        },
        fragment: {
          module,
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
            // view: <- to be filled out when we render
            clearValue: [0.3, 0.3, 0.3, 1],
            loadOp: 'clear',
            storeOp: 'store',
          },
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
        const encoder = device.createCommandEncoder({ label: 'our encoder' })

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
    main()
  }, [])

  useEffect(() => {
    dispatch({
      type: 'node_value_change',
      payload: { value: value, id: id },
    })
  }, [value, id, dispatch])

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: 'node_pointer_down',
      payload: { event: event, id: id },
    })
  }

  function handleContextMenu(event: PointerEvent<HTMLDivElement>) {
    dispatch({
      type: 'node_menu_show',
      payload: { event: event, id },
    })
  }

  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
    >
      {ports.filter((port) => port.kind === PortKind.Input).length <
      1 ? null : (
        <div className={styles.inputs}>
          {ports.map((port) =>
            port.kind !== PortKind.Input ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </div>
      )}
      <h1 className={styles.title}>{variant}</h1>
      <output className={styles.value}>
        <canvas className={styles.canvas} ref={canvasRef} />
      </output>
      {ports.filter((port) => port.kind === PortKind.Output).length <
      1 ? null : (
        <div className={styles.outputs}>
          {ports.map((port) =>
            port.kind !== PortKind.Output ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </div>
      )}
    </article>
  )
}
