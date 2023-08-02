'use client'

import styles from '@/styles/app.module.css'
import { useState, type ChangeEvent } from 'react'

export default function Home() {
  const [nodes, setNodes] = useState<number[]>(Array(7).fill(0))
  enum Operators {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    Modulo = 'modulo',
    Exponentiation = 'exponentiation',
  }
  const [operators, setOperators] = useState<Operators[]>(
    Array(3).fill(Operators.Addition)
  )

  function handleChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    const value = Number(event.currentTarget.value)
    const newNodes = [...nodes]
    newNodes[index] = value
    setNodes(newNodes)
  }

  function handleOperatorChange(
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ) {
    const value = event.currentTarget.value as Operators
    const newOperators = [...operators]
    newOperators[index] = value
    setOperators(newOperators)
  }

  function calculateNodes(
    nodeIndex: number,
    linkedNodeIndecies: number[],
    operatorIndex: number
  ) {
    switch (operators[operatorIndex]) {
      case Operators.Addition:
        return (nodes[nodeIndex] =
          nodes[linkedNodeIndecies[0]] + nodes[linkedNodeIndecies[1]])
      case Operators.Subtraction:
        return (nodes[nodeIndex] =
          nodes[linkedNodeIndecies[0]] - nodes[linkedNodeIndecies[1]])
      case Operators.Multiplication:
        return (nodes[nodeIndex] =
          nodes[linkedNodeIndecies[0]] * nodes[linkedNodeIndecies[1]])
      case Operators.Division:
        return (nodes[nodeIndex] =
          nodes[linkedNodeIndecies[0]] / nodes[linkedNodeIndecies[1]])
      case Operators.Exponentiation:
        return (nodes[nodeIndex] =
          nodes[linkedNodeIndecies[0]] ** nodes[linkedNodeIndecies[1]])
      case Operators.Modulo:
        return (nodes[nodeIndex] =
          nodes[linkedNodeIndecies[0]] % nodes[linkedNodeIndecies[1]])
      default:
        return (nodes[nodeIndex] =
          nodes[linkedNodeIndecies[0]] + nodes[linkedNodeIndecies[1]])
    }
  }

  return (
    <main className={styles.main}>
      <article className={styles.node} style={{ left: 50, top: 50 }}>
        <output className={styles.value} tabIndex={0}>
          {nodes[0]}
        </output>
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={nodes[0]}
          onChange={(event) => handleChange(event, 0)}
        />
        <div className={styles.outputs}>
          <button className={styles.port} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 50, top: 250 }}>
        <output className={styles.value} tabIndex={0}>
          {nodes[1]}
        </output>
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={nodes[1]}
          onChange={(event) => handleChange(event, 1)}
        />
        <div className={styles.outputs}>
          <button className={styles.port} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 50, top: 450 }}>
        <output className={styles.value} tabIndex={0}>
          {nodes[2]}
        </output>
        <input
          className={styles.slider}
          type='range'
          min='0'
          max='10'
          value={nodes[2]}
          onChange={(event) => handleChange(event, 2)}
        />
        <div className={styles.outputs}>
          <button className={styles.port} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 250, top: 150 }}>
        <div className={styles.inputs}>
          <button className={styles.port} />
          <button className={styles.port} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {calculateNodes(3, [0, 1], 0).toPrecision(3)}
        </output>
        <select
          className={styles.selector}
          value={operators[0]}
          onChange={(event) => handleOperatorChange(event, 0)}
        >
          <option value={Operators.Addition}>Addition</option>
          <option value={Operators.Subtraction}>Subtraction</option>
          <option value={Operators.Multiplication}>Multiplication</option>
          <option value={Operators.Division}>Division</option>
          <option value={Operators.Exponentiation}>Exponentiation</option>
          <option value={Operators.Modulo}>Modulo</option>
        </select>
        <div className={styles.outputs}>
          <button className={styles.port} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 250, top: 350 }}>
        <div className={styles.inputs}>
          <button className={styles.port} />
          <button className={styles.port} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {calculateNodes(4, [1, 2], 1).toPrecision(3)}
        </output>
        <select
          className={styles.selector}
          value={operators[1]}
          onChange={(event) => handleOperatorChange(event, 1)}
        >
          <option value={Operators.Addition}>Addition</option>
          <option value={Operators.Subtraction}>Subtraction</option>
          <option value={Operators.Multiplication}>Multiplication</option>
          <option value={Operators.Division}>Division</option>
          <option value={Operators.Exponentiation}>Exponentiation</option>
          <option value={Operators.Modulo}>Modulo</option>
        </select>
        <div className={styles.outputs}>
          <button className={styles.port} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 450, top: 250 }}>
        <div className={styles.inputs}>
          <button className={styles.port} />
          <button className={styles.port} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {calculateNodes(5, [3, 4], 2).toPrecision(3)}
        </output>
        <select
          className={styles.selector}
          value={operators[2]}
          onChange={(event) => handleOperatorChange(event, 2)}
        >
          <option value={Operators.Addition}>Addition</option>
          <option value={Operators.Subtraction}>Subtraction</option>
          <option value={Operators.Multiplication}>Multiplication</option>
          <option value={Operators.Division}>Division</option>
          <option value={Operators.Exponentiation}>Exponentiation</option>
          <option value={Operators.Modulo}>Modulo</option>
        </select>
        <div className={styles.outputs}>
          <button className={styles.port} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 650, top: 250 }}>
        <div className={styles.inputs}>
          <button className={styles.port} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {(nodes[6] = nodes[5]).toPrecision(3)}
        </output>
      </article>
      <svg className={styles.svg}>
        <path className={styles.path} d={'M 208 130 L 248 198'} />
        <path className={styles.path} d={'M 208 325 L 248 258'} />
        <path className={styles.path} d={'M 208 330 L 248 398'} />
        <path className={styles.path} d={'M 208 525 L 248 460'} />
        <path className={styles.path} d={'M 408 230 L 448 298'} />
        <path className={styles.path} d={'M 408 425 L 448 358'} />
        <path className={styles.path} d={'M 608 328 L 648 328'} />
      </svg>
    </main>
  )
}
