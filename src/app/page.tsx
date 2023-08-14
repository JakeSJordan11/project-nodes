'use client'

import styles from '@/styles/app.module.css'
import { useState, type ChangeEvent, type PointerEvent } from 'react'

export default function Home() {
  const [nodes, setNodes] = useState<NodeProps[]>(
    Array(7)
      .fill({ value: 0, linkedNodes: [] })
      .map((node) => ({ ...node, id: crypto.randomUUID() }))
  )
  const [operators, setOperators] = useState<OperatorVariants[]>(
    Array(3).fill(OperatorVariants.Addition)
  )
  const [streams, setStreams] = useState<StreamProps[]>([])

  const operations = {
    addition: (a: number, b: number) => a + b,
    subtraction: (a: number, b: number) => a - b,
    multiplication: (a: number, b: number) => a * b,
    division: (a: number, b: number) => a / b,
    exponentiation: (a: number, b: number) => a ** b,
    modulo: (a: number, b: number) => a % b,
  }

  function calculateValues(sourceNode: NodeProps, operators: OperatorVariants) {
    return sourceNode.linkedNodes.reduce(
      (acc, node) => operations[operators](acc, node.value),
      sourceNode.value
    )
  }

  function handleInputValueChange(
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
    const newOperators = [...operators]
    newOperators[index] = event.currentTarget.value as OperatorVariants
    setOperators(newOperators)
  }

  function handleOutputPortPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) {
    const newNodes = [...nodes]
    const nodeIndex = newNodes.findIndex((node) => node.id === nodeId)
    newNodes[nodeIndex].status = NodeStatus.Linking
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = [
      ...streams,
      {
        from: `${x + width / 2} ${y + height / 2}`,
        to: `${x + width / 2} ${y + height / 2}`,
        status: StreamStatus.Active,
      },
    ]
    setNodes(newNodes)
    setStreams(newStreams)
  }

  function handleInputPortPointerUp(
    event: PointerEvent<HTMLButtonElement>,
    sourceNode: NodeProps
  ) {
    event.stopPropagation()
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = [...streams]
    const lastStream = newStreams[newStreams.length - 1]
    lastStream.to = `${x + width / 2} ${y + height / 2}`
    lastStream.status = StreamStatus.Linked
    setStreams(newStreams)
    const newNodes = [...nodes]
    const nodeIndex = newNodes.findIndex((node) => node.id === sourceNode.id)
    newNodes[nodeIndex].status = NodeStatus.Active
    const targetNode = newNodes.find(
      (node) =>
        node.status === NodeStatus.Linking &&
        node.id !== sourceNode.id &&
        node.type !== NodeVariants.Output
    )
    if (targetNode) {
      targetNode.linkedNodes.push(sourceNode)
    }
    setNodes(newNodes)
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
    const newNodes = [...nodes].map((node) => {
      if (node.status !== NodeStatus.Linking) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    if (streams.length === 0) return
    const newStreams = [...streams].filter(
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
      <Input
        {...nodes[0]}
        value={nodes[0].value}
        position={{ x: 50, y: 50 }}
        nodeId={nodes[0].id}
        onInputValueChange={(event) =>
          handleInputValueChange(event, nodes[0].id)
        }
        onOutputPortPointerDown={(event) =>
          handleOutputPortPointerDown(event, nodes[0].id)
        }
      />
      <Input
        {...nodes[1]}
        value={nodes[1].value}
        position={{ x: 50, y: 250 }}
        nodeId={nodes[1].id}
        onInputValueChange={(event) =>
          handleInputValueChange(event, nodes[1].id)
        }
        onOutputPortPointerDown={(event) =>
          handleOutputPortPointerDown(event, nodes[1].id)
        }
      />
      <Input
        {...nodes[2]}
        value={nodes[2].value}
        position={{ x: 50, y: 450 }}
        nodeId={nodes[2].id}
        onInputValueChange={(event) =>
          handleInputValueChange(event, nodes[2].id)
        }
        onOutputPortPointerDown={(event) =>
          handleOutputPortPointerDown(event, nodes[2].id)
        }
      />
      <Operator
        {...nodes[3]}
        value={nodes[3].value}
        position={{ x: 250, y: 150 }}
        nodeId={nodes[3].id}
        operator={operators[0]}
        sourceNode={nodes[3]}
        handleOperatorChange={(event) => handleOperatorChange(event, 0)}
        handleOutputPortPointerDown={(event) =>
          handleOutputPortPointerDown(event, nodes[3].id)
        }
        calculateValues={calculateValues}
        handleInputPortPointerUp={(event) =>
          handleInputPortPointerUp(event, nodes[3])
        }
      />
      <Operator
        {...nodes[4]}
        value={nodes[4].value}
        position={{ x: 250, y: 350 }}
        nodeId={nodes[4].id}
        operator={operators[1]}
        sourceNode={nodes[4]}
        handleOperatorChange={(event) => handleOperatorChange(event, 1)}
        handleOutputPortPointerDown={(event) =>
          handleOutputPortPointerDown(event, nodes[4].id)
        }
        calculateValues={calculateValues}
        handleInputPortPointerUp={(event) =>
          handleInputPortPointerUp(event, nodes[4])
        }
      />
      <Operator
        {...nodes[5]}
        value={nodes[5].value}
        position={{ x: 450, y: 250 }}
        nodeId={nodes[5].id}
        operator={operators[2]}
        sourceNode={nodes[5]}
        handleOperatorChange={(event) => handleOperatorChange(event, 2)}
        handleOutputPortPointerDown={(event) =>
          handleOutputPortPointerDown(event, nodes[5].id)
        }
        calculateValues={calculateValues}
        handleInputPortPointerUp={(event) =>
          handleInputPortPointerUp(event, nodes[5])
        }
      />
      <Output
        nodeValue={nodes[6].value}
        position={{ x: 650, y: 250 }}
        targetValue={nodes[5].value}
        handleInputPortPointerUp={(event) =>
          handleInputPortPointerUp(event, nodes[6])
        }
      />
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
export function Input({
  position,
  value,
  nodeId,
  onInputValueChange,
  onOutputPortPointerDown,
}: {
  position: Coordinate
  value: number
  nodeId: string
  onInputValueChange: (
    event: ChangeEvent<HTMLInputElement>,
    nodeId: string
  ) => void
  onOutputPortPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) => void
}) {
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
    >
      <output className={styles.value}>{value}</output>
      <input
        className={styles.slider}
        type='range'
        max={10}
        value={value}
        onChange={(event) => onInputValueChange(event, nodeId)}
      />
      <div className={styles.outputs}>
        <button
          className={styles.port}
          onPointerDown={(event) => onOutputPortPointerDown(event, nodeId)}
        />
      </div>
    </article>
  )
}

export function Operator({
  value,
  nodeId,
  position,
  operator,
  sourceNode,
  handleOperatorChange,
  handleOutputPortPointerDown,
  calculateValues,
  handleInputPortPointerUp,
}: {
  value: number
  nodeId: string
  position: Coordinate
  operator: OperatorVariants
  sourceNode: NodeProps
  handleOperatorChange: (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => void
  handleOutputPortPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) => void
  calculateValues: (
    sourceNode: NodeProps,
    operators: OperatorVariants
  ) => number
  handleInputPortPointerUp: (
    event: PointerEvent<HTMLButtonElement>,
    nodeValue: number
  ) => void
}) {
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
    >
      <div className={styles.inputs}>
        <button
          className={styles.port}
          onPointerUp={(event) => handleInputPortPointerUp(event, value)}
        />
        <button
          className={styles.port}
          onPointerUp={(event) => handleInputPortPointerUp(event, value)}
        />
      </div>
      <output className={styles.value}>
        {calculateValues(sourceNode, operator)}
      </output>
      <select
        className={styles.selector}
        value={operator}
        onChange={(event) => handleOperatorChange(event, 2)}
      >
        <option value={OperatorVariants.Addition}>Addition</option>
        <option value={OperatorVariants.Subtraction}>Subtraction</option>
        <option value={OperatorVariants.Multiplication}>Multiplication</option>
        <option value={OperatorVariants.Division}>Division</option>
        <option value={OperatorVariants.Exponentiation}>Exponentiation</option>
        <option value={OperatorVariants.Modulo}>Modulo</option>
      </select>
      <div className={styles.outputs}>
        <button
          className={styles.port}
          onPointerDown={(event) => handleOutputPortPointerDown(event, nodeId)}
        />
      </div>
    </article>
  )
}

export function Output({
  nodeValue,
  position,
  targetValue,
  handleInputPortPointerUp,
}: {
  nodeValue: number
  position: Coordinate
  targetValue: number
  handleInputPortPointerUp: (
    event: PointerEvent<HTMLButtonElement>,
    nodeValue: number
  ) => void
}) {
  return (
    <article
      className={styles.node}
      style={{ left: position.x, top: position.y }}
    >
      <div className={styles.inputs}>
        <button
          className={styles.port}
          onPointerUp={(event) => handleInputPortPointerUp(event, nodeValue)}
        />
      </div>
      <output className={styles.value}>{(nodeValue = targetValue)}</output>
    </article>
  )
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
  Active = 'active',
  Linking = 'linking',
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
  linkedNodes: NodeProps[]
}

interface StreamProps {
  from: string
  to: string
  status: StreamStatus
}

export interface Coordinate {
  x: number
  y: number
}
