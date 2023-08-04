'use client'

import styles from '@/styles/app.module.css'
import { useState, type ChangeEvent } from 'react'

export default function Home() {
  const [nodes, setNodes] = useState<number[]>(Array(7).fill(0))
  enum Operator {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    Modulo = 'modulo',
    Exponentiation = 'exponentiation',
  }
  const [operators, setOperators] = useState<Operator[]>(
    Array(3).fill(Operator.Addition)
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
    const value = event.currentTarget.value as Operator
    const newOperators = [...operators]
    newOperators[index] = value
    setOperators(newOperators)
  }

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
          {(nodes[3] = calculateValues(nodes[0], nodes[1], operators[0]))}
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
          <button className={styles.port} />
        </div>
      </article>
      <article className={styles.node} style={{ left: 250, top: 350 }}>
        <div className={styles.inputs}>
          <button className={styles.port} />
          <button className={styles.port} />
        </div>
        <output className={styles.value} tabIndex={0}>
          {(nodes[4] = calculateValues(nodes[1], nodes[2], operators[1]))}
        </output>
        <select
          className={styles.selector}
          value={operators[1]}
          onChange={(event) => handleOperatorChange(event, 1)}
        >
          <option value={Operator.Addition}>Addition</option>
          <option value={Operator.Subtraction}>Subtraction</option>
          <option value={Operator.Multiplication}>Multiplication</option>
          <option value={Operator.Division}>Division</option>
          <option value={Operator.Exponentiation}>Exponentiation</option>
          <option value={Operator.Modulo}>Modulo</option>
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
          {(nodes[5] = calculateValues(nodes[3], nodes[4], operators[2]))}
        </output>
        <select
          className={styles.selector}
          value={operators[2]}
          onChange={(event) => handleOperatorChange(event, 2)}
        >
          <option value={Operator.Addition}>Addition</option>
          <option value={Operator.Subtraction}>Subtraction</option>
          <option value={Operator.Multiplication}>Multiplication</option>
          <option value={Operator.Division}>Division</option>
          <option value={Operator.Exponentiation}>Exponentiation</option>
          <option value={Operator.Modulo}>Modulo</option>
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
          {(nodes[6] = nodes[5])}
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
