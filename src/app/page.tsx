'use client'

import styles from '@/styles/app.module.css'
import { useState, type ChangeEvent, type PointerEvent } from 'react'

export default function Application() {
  const [nodes, setNodes] = useState<Node[]>(
    Array(7)
      .fill({ value: 0, linkedNodeIds: [] })
      .map((node) => ({ ...node, id: crypto.randomUUID() }))
  )

  const [operators, setOperators] = useState<Operator[]>(Array(3).fill(Operator.Addition))

  const [streams, setStreams] = useState<Stream[]>([])

  const operations = {
    addition: (a: number, b: number) => a + b,
    subtraction: (a: number, b: number) => a - b,
    multiplication: (a: number, b: number) => a * b,
    division: (a: number, b: number) => a / b,
    exponentiation: (a: number, b: number) => a ** b,
    modulo: (a: number, b: number) => a % b,
  }

  let linkingNode: Node

  function calculateValues(left: number, right: number, operator: Operator) {
    const result = operations[operator](left, right)
    if (isNaN(result)) return 0
    return result
  }

  function handleNodeValueChange(event: ChangeEvent<HTMLInputElement>, nodeId: string) {
    const newNodes = [...nodes]
    const nodeIndex = newNodes.findIndex((node) => node.id === nodeId)
    newNodes[nodeIndex].value = Number(event.currentTarget.value)
    setNodes(newNodes)
  }

  function handleOperatorChange(event: ChangeEvent<HTMLSelectElement>, index: number) {
    const newOperators = [...operators]
    newOperators[index] = event.currentTarget.value as Operator
    setOperators(newOperators)
  }

  function handleOutputPortPointerDown(event: PointerEvent<HTMLButtonElement>, nodeId: string) {
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
    linkingNode = newNodes[nodeIndex]
  }

  function handleInputPortPointerUp(event: PointerEvent<HTMLButtonElement>) {
    const { x, y, width, height } = event.currentTarget.getBoundingClientRect()
    const newStreams = [...streams]
    const lastStream = newStreams[newStreams.length - 1]
    lastStream.to = `${x + width / 2} ${y + height / 2}`
    lastStream.status = StreamStatus.Linked
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
    const newNodes = [...nodes].map((node) => {
      if (node.status !== NodeStatus.Linking) return node
      return {
        ...node,
        status: NodeStatus.Inactive,
      }
    })
    if (streams.length === 0) return
    const newStreams = [...streams].filter((stream) => stream.status === StreamStatus.Linked)
    setNodes(newNodes)
    setStreams(newStreams)
  }

  return (
    <main className={styles.main} onPointerMove={handleMainPointerMove} onPointerUp={handleMainPointerUp}>
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
          <button className={styles.port} onPointerDown={(event) => handleOutputPortPointerDown(event, nodes[0].id)} />
        </div>
      </article>

      <article className={styles.node} style={{ left: 50, top: 250 }}>
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
          <button className={styles.port} onPointerDown={(event) => handleOutputPortPointerDown(event, nodes[1].id)} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 50, top: 450 }}>
        <output className={styles.value} tabIndex={0}>
          {nodes[2].value}
        </output>
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={nodes[2].value}
          onChange={(event) => handleNodeValueChange(event, nodes[2].id)}
        />
        <div className={styles.outputs}>
          <button className={styles.port} onPointerDown={(event) => handleOutputPortPointerDown(event, nodes[2].id)} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 250, top: 150 }}>
        <div className={styles.inputs}>
          <button className={styles.port} onPointerUp={handleInputPortPointerUp} />
          <button className={styles.port} onPointerUp={handleInputPortPointerUp} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {(nodes[3].value = calculateValues(nodes[0].value, nodes[1].value, operators[0]))}
        </output>
        <select className={styles.selector} value={operators[0]} onChange={(event) => handleOperatorChange(event, 0)}>
          <option value={Operator.Addition}>Addition</option>
          <option value={Operator.Subtraction}>Subtraction</option>
          <option value={Operator.Multiplication}>Multiplication</option>
          <option value={Operator.Division}>Division</option>
          <option value={Operator.Exponentiation}>Exponentiation</option>
          <option value={Operator.Modulo}>Modulo</option>
        </select>
        <div className={styles.outputs}>
          <button className={styles.port} onPointerDown={(event) => handleOutputPortPointerDown(event, nodes[3].id)} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 250, top: 350 }}>
        <div className={styles.inputs}>
          <button className={styles.port} onPointerUp={handleInputPortPointerUp} />
          <button className={styles.port} onPointerUp={handleInputPortPointerUp} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {(nodes[4].value = calculateValues(nodes[1].value, nodes[2].value, operators[1]))}
        </output>
        <select className={styles.selector} value={operators[1]} onChange={(event) => handleOperatorChange(event, 1)}>
          <option value={Operator.Addition}>Addition</option>
          <option value={Operator.Subtraction}>Subtraction</option>
          <option value={Operator.Multiplication}>Multiplication</option>
          <option value={Operator.Division}>Division</option>
          <option value={Operator.Exponentiation}>Exponentiation</option>
          <option value={Operator.Modulo}>Modulo</option>
        </select>
        <div className={styles.outputs}>
          <button className={styles.port} onPointerDown={(event) => handleOutputPortPointerDown(event, nodes[4].id)} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 450, top: 250 }}>
        <div className={styles.inputs}>
          <button className={styles.port} onPointerUp={handleInputPortPointerUp} />
          <button className={styles.port} onPointerUp={handleInputPortPointerUp} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {(nodes[5].value = calculateValues(nodes[3].value, nodes[4].value, operators[2]))}
        </output>
        <select className={styles.selector} value={operators[2]} onChange={(event) => handleOperatorChange(event, 2)}>
          <option value={Operator.Addition}>Addition</option>
          <option value={Operator.Subtraction}>Subtraction</option>
          <option value={Operator.Multiplication}>Multiplication</option>
          <option value={Operator.Division}>Division</option>
          <option value={Operator.Exponentiation}>Exponentiation</option>
          <option value={Operator.Modulo}>Modulo</option>
        </select>
        <div className={styles.outputs}>
          <button className={styles.port} onPointerDown={(event) => handleOutputPortPointerDown(event, nodes[5].id)} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 650, top: 250 }}>
        <div className={styles.inputs}>
          <button className={styles.port} onPointerUp={handleInputPortPointerUp} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {(nodes[6].value = nodes[5].value)}
        </output>
      </article>
      <svg className={styles.svg} xmlns='http://www.w3.org/2000/svg'>
        {streams.map((stream) => (
          <path key={crypto.randomUUID()} d={`M ${stream.from} L ${stream.to}`} />
        ))}
      </svg>
    </main>
  )
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
