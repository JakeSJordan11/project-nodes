'use client'

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

export interface NodeProperties {
  id: string
  name: string
  value: number
  type: string
}

export interface NodeProps {
  id: string
  ports: PortProps[]
  position: { x: number; y: number }
  isSelected?: boolean
  isDragging?: boolean
  variant: NodeVariant
  mathOperation?: MathOperation
  title: string
  properties?: NodeProperties[]

  value: number | boolean | string | undefined | any // TODO: derive this state from node variant
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
  properties,
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
      <h1 className={styles.title}>{title}</h1>
      {variant === NodeVariant.WebGPU ? (
        properties?.map((property: any) => (
          <WebGPU key={property.id} property={property} />
        ))
      ) : (
        <output className={styles.value}>{value}</output>
      )}
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

export default function WebGPU(property: any) {
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
      const adapter = await navigator.gpu?.requestAdapter()
      const device = (await adapter?.requestDevice()) as GPUDevice
      if (!device) {
        fail('need a browser that supports WebGPU')
        return
      }

      // Get a WebGPU context from the canvas and configure it
      // const canvas = document.querySelector('canvas')
      const canvas = canvasRef.current as HTMLCanvasElement
      // if (!canvas) throw new Error(`Could not find canvas`)
      const context = canvas.getContext('webgpu') as GPUCanvasContext
      // if (!context) throw new Error('Could not generate context for canvas.')
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      })

      const myModule = device.createShaderModule({
        code: `
      struct Uniforms {
        color: vec4f,
        resolution: vec2f,
        translation: vec2f,
      };

      struct Vertex {
        @location(0) position: vec2f,
      };

      struct VSOutput {
        @builtin(position) position: vec4f,
      };

      @group(0) @binding(0) var<uniform> uni: Uniforms;

      @vertex fn vs(vert: Vertex) -> VSOutput {
        var vsOut: VSOutput;
        
        // Add in the translation
        let position = vert.position + uni.translation;

        // convert the position from pixels to a 0.0 to 1.0 value
        let zeroToOne = position / uni.resolution;

        // convert from 0 <-> 1 to 0 <-> 2
        let zeroToTwo = zeroToOne * 2.0;

        // covert from 0 <-> 2 to -1 <-> +1 (clip space)
        let flippedClipSpace = zeroToTwo - 1.0;

        // flip Y
        let clipSpace = flippedClipSpace * vec2f(1, -1);

        vsOut.position = vec4f(clipSpace, 0.0, 1.0);
        return vsOut;
      }

      @fragment fn fs(vsOut: VSOutput) -> @location(0) vec4f {
        return uni.color;
      }
    `,
      })

      const pipeline = device.createRenderPipeline({
        label: 'just 2d position',
        layout: 'auto',
        vertex: {
          module: myModule,
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
          module: myModule,
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
        tranlastion: [0, 0],
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
      // }
    }

    function fail(msg: string) {
      alert(msg)
    }

    main()
  }, [])

  return <canvas ref={canvasRef} className={styles.value} />
}
