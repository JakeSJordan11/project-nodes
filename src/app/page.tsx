'use client'

import styles from '@/styles/app.module.css'
import { useState, type ChangeEvent, type PointerEvent } from 'react'

export default function Home() {
  const [nodes, setNodes] = useState<NodeProps[]>(initialNodes)
  const [streams, setStreams] = useState<StreamProps[]>([])
  const { activeStream, transmitter, reciever } = useStream(streams, nodes)

  function handleCalculatedValues(operators: OperatorVariants) {
    if (!transmitter || !reciever) return
    return operations[operators](transmitter.value, reciever.value)
  }

  function handleInputValueChange(event: ChangeEvent<HTMLInputElement>, nodeId: string) {
    const newNodeValues = nodes.map((node) => {
      if (node.id !== nodeId) return node
      return { ...node, value: Number(event.currentTarget.value) }
    })
    setNodes(newNodeValues)
  }

  function handleOutputPointerDown(event: PointerEvent<HTMLButtonElement>, nodeId: string) {
    const newNodeStatus = nodes.map((node) => {
      if (node.id !== nodeId) return node
      return { ...node, status: NodeStatus.Searching }
    })
    setNodes(newNodeStatus)
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = [
      ...streams,
      {
        id: crypto.randomUUID(),
        from: `${x + width / 2} ${y + height / 2}`,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Active,
        transmitterId: nodeId,
      },
    ] as StreamProps[]
    setStreams(newStreams)
  }

  function handleInputPointerUp(event: PointerEvent<HTMLButtonElement>, sourceNode: NodeProps) {
    event.stopPropagation()
    const newNodes = nodes.map((node) => {
      if (activeStream?.status === StreamStatus.Active) {
        return {
          ...node,
          status: transmitter?.id === node.id ? NodeStatus.Transmitting : NodeStatus.Recieving,
          linkedIds: [...node.linkedIds, transmitter?.id === node.id ? sourceNode.id : transmitter?.id],
        }
      }
    }) as NodeProps[]
    setNodes(newNodes)
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const LinkActiveStream = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return {
        ...stream,
        status: StreamStatus.Linked,
        to: `${x + width / 2} ${y + height / 2}`,
        recieverId: sourceNode.id,
      }
    })
    setStreams(LinkActiveStream)
  }

  function handleMainPointerMove(event: PointerEvent<HTMLElement>) {
    if (streams.length === 0) return
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return { ...stream, to: `${event.clientX} ${event.clientY}` }
    })
    setStreams(newStreams)
  }

  function handleMainPointerUp() {
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Searching) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    if (streams.length === 0) return
    const newStreams = streams.filter((stream) => stream.status === StreamStatus.Linked)
    setNodes(newNodes)
    setStreams(newStreams)
  }
  return (
    <main className={styles.main} onPointerMove={handleMainPointerMove} onPointerUp={handleMainPointerUp}>
      <Input
        {...nodes[0]}
        position={{ x: 50, y: 50 }}
        onInputValueChange={(event) => handleInputValueChange(event, nodes[0].id)}
        onOutputPointerDown={(event) => handleOutputPointerDown(event, nodes[0].id)}
      />
      <Input
        {...nodes[1]}
        position={{ x: 50, y: 250 }}
        onInputValueChange={(event) => handleInputValueChange(event, nodes[1].id)}
        onOutputPointerDown={(event) => handleOutputPointerDown(event, nodes[1].id)}
      />
      <Input
        {...nodes[2]}
        position={{ x: 50, y: 450 }}
        onInputValueChange={(event) => handleInputValueChange(event, nodes[2].id)}
        onOutputPointerDown={(event) => handleOutputPointerDown(event, nodes[2].id)}
      />
      <Operator
        {...nodes[3]}
        position={{ x: 250, y: 150 }}
        onOutputPointerDown={(event) => handleOutputPointerDown(event, nodes[3].id)}
        onInputPointerUp={(event) => handleInputPointerUp(event, nodes[3])}
      />
      <Operator
        {...nodes[4]}
        position={{ x: 250, y: 350 }}
        onOutputPointerDown={(event) => handleOutputPointerDown(event, nodes[4].id)}
        onInputPointerUp={(event) => handleInputPointerUp(event, nodes[4])}
      />
      <Operator
        {...nodes[5]}
        position={{ x: 450, y: 250 }}
        onOutputPointerDown={(event) => handleOutputPointerDown(event, nodes[5].id)}
        onInputPointerUp={(event) => handleInputPointerUp(event, nodes[5])}
      />
      <Output
        {...nodes[6]}
        position={{ x: 650, y: 250 }}
        targetValue={nodes[5].value}
        onInputPointerUp={(event) => handleInputPointerUp(event, nodes[6])}
      />
      <svg className={styles.svg} xmlns='http://www.w3.org/2000/svg'>
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </main>
  )
}
export function Input({
  id,
  value,
  position,
  onInputValueChange,
  onOutputPointerDown,
}: NodeProps & {
  onInputValueChange: (event: ChangeEvent<HTMLInputElement>, nodeId: string) => void
  onOutputPointerDown: (event: PointerEvent<HTMLButtonElement>, nodeId: string) => void
}) {
  return (
    <article className={styles.node} style={{ left: position.x, top: position.y }}>
      <output className={styles.value}>{value}</output>
      <input
        className={styles.slider}
        type='range'
        max={10}
        value={value}
        onChange={(event) => onInputValueChange(event, id)}
      />
      <div className={styles.outputs}>
        <button className={styles.port} onPointerDown={(event) => onOutputPointerDown(event, id)} />
      </div>
    </article>
  )
}

export function Operator({
  id,
  value,
  position,
  onInputPointerUp,
  onOutputPointerDown,
}: NodeProps & {
  onInputPointerUp: (event: PointerEvent<HTMLButtonElement>, nodeValue: number) => void
  onOutputPointerDown: (event: PointerEvent<HTMLButtonElement>, nodeId: string) => void
}) {
  return (
    <article className={styles.node} style={{ left: position.x, top: position.y }}>
      <div className={styles.inputs}>
        <button className={styles.port} onPointerUp={(event) => onInputPointerUp(event, value)} />
        <button className={styles.port} onPointerUp={(event) => onInputPointerUp(event, value)} />
      </div>
      <output className={styles.value}>{value}</output>
      <select className={styles.selector} value={value}>
        <option value={OperatorVariants.Addition}>Addition</option>
        <option value={OperatorVariants.Subtraction}>Subtraction</option>
        <option value={OperatorVariants.Multiplication}>Multiplication</option>
        <option value={OperatorVariants.Division}>Division</option>
        <option value={OperatorVariants.Exponentiation}>Exponentiation</option>
        <option value={OperatorVariants.Modulo}>Modulo</option>
      </select>
      <div className={styles.outputs}>
        <button className={styles.port} onPointerDown={(event) => onOutputPointerDown(event, id)} />
      </div>
    </article>
  )
}

export function Output({
  value,
  position,
  targetValue,
  onInputPointerUp,
}: NodeProps & {
  targetValue: number
  onInputPointerUp: (event: PointerEvent<HTMLButtonElement>, nodeValue: number) => void
}) {
  return (
    <article className={styles.node} style={{ left: position.x, top: position.y }}>
      <div className={styles.inputs}>
        <button className={styles.port} onPointerUp={(event) => onInputPointerUp(event, value)} />
      </div>
      <output className={styles.value}>{(value = targetValue)}</output>
    </article>
  )
}

export function Stream({ from, to }: StreamProps) {
  return <path d={`M ${from} L ${to}`} />
}

export const operations = {
  addition: (a: number, b: number) => a + b,
  subtraction: (a: number, b: number) => a - b,
  multiplication: (a: number, b: number) => a * b,
  division: (a: number, b: number) => a / b,
  exponentiation: (a: number, b: number) => a ** b,
  modulo: (a: number, b: number) => a % b,
}

enum OperatorVariants {
  Addition = 'addition',
  Subtraction = 'subtraction',
  Multiplication = 'multiplication',
  Division = 'division',
  Modulo = 'modulo',
  Exponentiation = 'exponentiation',
}

enum StreamStatus {
  Inactive = 'inactive',
  Active = 'active',
  Linked = 'linked',
}

enum NodeStatus {
  Inactive = 'inactive',
  Transmitting = 'transmitting',
  Searching = 'searching',
  Recieving = 'recieving',
}

enum NodeVariants {
  Input = 'input',
  Output = 'output',
  Operator = 'operator',
}

interface NodeProps {
  id: string
  value: number
  status: NodeStatus
  type: NodeVariants
  linkedIds: string[]
  position: Coordinate
  operator?: OperatorVariants
}

interface StreamProps {
  id: string
  from: string
  to: string
  status: StreamStatus
  transmitterId: string
  recieverId: string
}

export interface Coordinate {
  x: number
  y: number
}

export function useStream(streams: StreamProps[], nodes: NodeProps[]) {
  const activeStream = streams.find((stream) => stream.status === StreamStatus.Active)
  const linkedStreams = streams.find((stream) => stream.status === StreamStatus.Linked)
  const transmitter = activeStream
    ? nodes.find((node) => node.id === activeStream.transmitterId)
    : linkedStreams
    ? nodes.find((node) => node.id === linkedStreams.transmitterId)
    : null
  const reciever = activeStream
    ? nodes.find((node) => node.id === activeStream.recieverId)
    : linkedStreams
    ? nodes.find((node) => node.id === linkedStreams?.recieverId)
    : null
  return { transmitter, reciever, activeStream, linkedStreams }
}

const initialNodes: NodeProps[] = [
  {
    id: crypto.randomUUID(),
    value: 0,
    status: NodeStatus.Inactive,
    type: NodeVariants.Input,
    linkedIds: [],
    position: { x: 50, y: 50 },
  },
  {
    id: crypto.randomUUID(),
    value: 0,
    status: NodeStatus.Inactive,
    type: NodeVariants.Input,
    linkedIds: [],
    position: { x: 50, y: 250 },
  },
  {
    id: crypto.randomUUID(),
    value: 0,
    status: NodeStatus.Inactive,
    type: NodeVariants.Input,
    linkedIds: [],
    position: { x: 50, y: 450 },
  },
  {
    id: crypto.randomUUID(),
    value: 0,
    status: NodeStatus.Inactive,
    type: NodeVariants.Operator,
    linkedIds: [],
    position: { x: 250, y: 150 },
  },
  {
    id: crypto.randomUUID(),
    value: 0,
    status: NodeStatus.Inactive,
    type: NodeVariants.Operator,
    linkedIds: [],
    position: { x: 250, y: 350 },
  },
  {
    id: crypto.randomUUID(),
    value: 0,
    status: NodeStatus.Inactive,
    type: NodeVariants.Operator,
    linkedIds: [],
    position: { x: 450, y: 250 },
  },
  {
    id: crypto.randomUUID(),
    value: 0,
    status: NodeStatus.Inactive,
    type: NodeVariants.Output,
    linkedIds: [],
    position: { x: 650, y: 250 },
  },
]
