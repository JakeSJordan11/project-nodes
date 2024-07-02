'use client'

import { useWebGPU } from '@/context/webgpu.context'
import {
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  type PointerEvent,
} from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import { Port, PortKind, type PortProps } from '../port'
import styles from './node.module.css'
import shader from './webgpu.wgsl'

export enum NodeVariant {
  Number = 'number',
  Math = 'math',
  WebGPU = 'webgpu',
}
export enum MathOperation {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
  Modulo = '%',
  Power = '**',
}
export interface NodeProps {
  id: string
  ports: PortProps[]
  position: { x: number; y: number }
  variant: NodeVariant
  title: string
  mathOperation?: MathOperation
  isDragging: boolean // TODO: derive this state from node variant
  isSelected: boolean // TODO: derive this state from node variant
  translationX: number // TODO: derive this state from node variant
  translationY: number // TODO: derive this state from node variant

  value: any // TODO: derive this state from node variant
  offset: { x: number; y: number } // TODO: derive this state this may need to be created locally, but I don't think it needs to be in the global state
  scrollPosition: { x: number; y: number } // TODO: derive this state
}

export function Node({
  scrollPosition,
  id,
  value,
  position,
  ports,
  title,
  variant,
  translationX,
  translationY,
}: NodeProps) {
  const { dispatch } = useGraph()
  const memoizedPayload = useMemo(() => ({ value: value, id: id }), [value, id])

  useEffect(() => {
    dispatch({
      type: GraphActionTypes.NODE_VALUE_CHANGE,
      payload: memoizedPayload,
    })
  }, [memoizedPayload, dispatch])

  function handleMouseDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: GraphActionTypes.NODE_MOUSE_DOWN,
      payload: { event: event, id: id },
    })
  }

  function handleMouseUp(event: MouseEvent<HTMLElement>) {
    dispatch({
      type: GraphActionTypes.NODE_MOUSE_UP,
      payload: { event: event, id: id },
    })
  }

  return (
    <article
      className={styles.node}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        left: position.x + scrollPosition.x,
        top: position.y + scrollPosition.y,
      }}
    >
      <div className={styles.inputs}>
        {ports
          .filter((port) => port.kind === PortKind.Input)
          .map((port) => (
            <Port {...port} key={port.id} />
          ))}
      </div>
      <h1 className={styles.title}>{title}</h1>
      {variant === NodeVariant.WebGPU ? (
        <WebGPUComponent
          translationX={translationX}
          translationY={translationY}
          ports={ports}
        />
      ) : (
        <output className={styles.value}>{value}</output>
      )}
      <div className={styles.outputs}>
        {ports
          .filter((port) => port.kind === PortKind.Output)
          .map((port) => (
            <Port {...port} key={port.id} />
          ))}
      </div>
    </article>
  )
}

export function WebGPUComponent({
  translationX,
  translationY,
  ports,
}: {
  translationX: NodeProps['translationX']
  translationY: NodeProps['translationY']
  ports: NodeProps['ports']
}) {
  const { device, presentationFormat } = useWebGPU()
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  useEffect(() => {
    async function main() {
      if (!device || !presentationFormat) {
        console.error('WebGPU device or format not available.')
        return
      }

      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('webgpu') as GPUCanvasContext

      context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      })

      // WebGPU rendering logic...
      const shaderModule = device.createShaderModule({
        code: shader,
      })

      const pipeline = device.createRenderPipeline({
        label: 'just 2d position',
        layout: 'auto',
        vertex: {
          module: shaderModule,
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
          targets: [{ format: presentationFormat }],
        },
      })

      // color, resolution, translation
      const uniformBufferSize = (4 + 2 + 2) * 4
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
      colorValue.set([1, 1, 0, 1])

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
        tranlastion: [
          Number(ports[0].value) >= 0 ? Number(ports[0].value) : translationX,
          Number(ports[1].value) >= 0 ? Number(ports[1].value) : translationY,
        ],
      }

      function render() {
        if (!device || !presentationFormat) {
          console.error('WebGPU device or format not available.')
          return
        }
        if (!canvas) return

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
        translationValue.set(settings.tranlastion)

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

    main()
  }, [translationX, translationY, device, presentationFormat, ports])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
