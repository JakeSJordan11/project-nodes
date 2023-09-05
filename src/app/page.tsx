'use client'

import styles from '@/styles/app.module.css'
import { useState, type ChangeEvent, type PointerEvent } from 'react'

export default function Application() {
  const [nodes, setNodes] = useState<Node[]>(
    Array(4)
      .fill({ value: 0, linkedNodeIds: [] })
      .map((node) => ({ ...node, id: crypto.randomUUID() }))
  )

  const [operators, setOperators] = useState<Operator[]>(
    Array(3).fill(Operator.Addition)
  )

  const [streams, setStreams] = useState<Stream[]>([])

  const operations = {
    addition: (a: number, b: number) => a + b,
    subtraction: (a: number, b: number) => a - b,
    multiplication: (a: number, b: number) => a * b,
    division: (a: number, b: number) => a / b,
    exponentiation: (a: number, b: number) => a ** b,
    modulo: (a: number, b: number) => a % b,
  }

  function calculateValues(left: number, right: number, operator: Operator) {
    const result = operations[operator](left, right)
    if (isNaN(result)) return 0
    return result
  }

  function handleNodeValueChange(
    event: ChangeEvent<HTMLInputElement>,
    nodeId: string
  ) {
    const newNodes = [...nodes]
    const nodeIndex = newNodes.findIndex((node) => node.id === nodeId)
    newNodes[nodeIndex].value = Number(event.currentTarget.value)
    setNodes(newNodes)
  }

  function handleOperatorChange(
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) {
    setOperators(
      operators.map((operator, i) =>
        i === index ? (event.currentTarget.value as Operator) : operator
      )
    )
  }

  function handleOutputPortPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) {
    setNodes(
      nodes.map((node) => {
        if (node.id !== nodeId) return node
        return {
          ...node,
          status: NodeStatus.Linking,
        }
      })
    )
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    setStreams([
      ...streams,
      {
        from: `${x + width / 2} ${y + height / 2}`,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Active,
      },
    ])
  }

  function handleInputPortPointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation()
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Linking) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    setNodes(newNodes)
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream
      return {
        ...stream,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Linked,
      }
    })
    setStreams(newStreams)
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
      if (node.status !== NodeStatus.Linking) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    const newStreams = streams.filter(
      (stream) => stream.status === StreamStatus.Linked
    )
    setNodes(newNodes)
    setStreams(newStreams)
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      <article className={styles.node} style={{ left: 50, top: 50 }}>
        <output className={styles.value} tabIndex={0}>
          {nodes[0].value}
        </output>
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={nodes[0].value}
          onChange={(event) => handleNodeValueChange(event, nodes[0].id)}
        />
        <div className={styles.outputs}>
          <Port
            id='0'
            value={nodes[0].value}
            onPortPointerDown={(event) =>
              handleOutputPortPointerDown(event, nodes[0].id)
            }
          />
        </div>
      </article>

      <article className={styles.node} style={{ left: 50, top: 300 }}>
        <output className={styles.value} tabIndex={0}>
          {nodes[1].value}
        </output>
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={nodes[1].value}
          onChange={(event) => handleNodeValueChange(event, nodes[1].id)}
        />
        <div className={styles.outputs}>
          <Port
            id='1'
            value={nodes[1].value}
            onPortPointerDown={(event) =>
              handleOutputPortPointerDown(event, nodes[1].id)
            }
          />
        </div>
      </article>

      <article className={styles.node} style={{ left: 350, top: 175 }}>
        <div className={styles.inputs}>
          <button
            className={styles.port}
            onPointerUp={handleInputPortPointerUp}
          />
          <button
            className={styles.port}
            onPointerUp={handleInputPortPointerUp}
          />
        </div>
        <output className={styles.value} tabIndex={0}>
          {
            (nodes[2].value = calculateValues(
              nodes[0].value,
              nodes[1].value,
              operators[0]
            ))
          }
        </output>
        <select
          className={styles.selector}
          value={operators[0]}
          onChange={(event) => handleOperatorChange(event, 0)}
        >
          <option value={Operator.Addition}>Addition</option>
          <option value={Operator.Subtraction}>Subtraction</option>
          <option value={Operator.Multiplication}>Multiplication</option>
          <option value={Operator.Division}>Division</option>
          <option value={Operator.Exponentiation}>Exponentiation</option>
          <option value={Operator.Modulo}>Modulo</option>
        </select>
        <div className={styles.outputs}>
          <button
            className={styles.port}
            onPointerDown={(event) =>
              handleOutputPortPointerDown(event, nodes[2].id)
            }
          />
        </div>
      </article>

      <article className={styles.node} style={{ left: 650, top: 175 }}>
        <div className={styles.inputs}>
          <button
            className={styles.port}
            onPointerUp={handleInputPortPointerUp}
          />
        </div>
        <output className={styles.value} tabIndex={0}>
          {(nodes[3].value = nodes[2].value)}
        </output>
      </article>

      <svg className={styles.svg} xmlns='http://www.w3.org/2000/svg'>
        {streams.map((stream) => (
          <path
            key={crypto.randomUUID()}
            d={`M ${stream.from} L ${stream.to}`}
          />
        ))}
      </svg>
    </main>
  )
}

function Port({
  onPortPointerDown,
}: {
  onPortPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
} & PortProps) {
  return <button className={styles.port} onPointerDown={onPortPointerDown} />
}

enum Operator {
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
  Active = 'active',
  Linking = 'linking',
}

interface Node {
  id: string
  value: number
  linkedNodeIds: string[]
  status: NodeStatus
}

interface Stream {
  from: string
  to: string
  status: StreamStatus
}

interface PortProps {
  id: string
  value: number
}
