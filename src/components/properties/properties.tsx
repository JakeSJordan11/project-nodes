'use client'

import { type ChangeEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import { MathOperation, NodeVariant, type NodeProps } from '../node'
import styles from './properties.module.css'

export function Properties() {
  const { state, dispatch } = useGraph()

  function handleSliderChange(
    event: ChangeEvent<HTMLInputElement>,
    id: NodeProps['id']
  ) {
    dispatch({
      type: GraphActionTypes.NUMBER_NODE_SLIDER_CHANGE,
      payload: { event: event, id: id },
    })
  }

  function handleSelectionChange(
    event: ChangeEvent<HTMLSelectElement>,
    id: NodeProps['id']
  ) {
    dispatch({
      type: GraphActionTypes.MATH_NODE_OPERATION_CHANGE,
      payload: { event: event, id: id },
    })
  }

  return (
    <article className={styles.properties}>
      <h1 className={styles.title}>properties</h1>
      {state.nodes.map((node) => {
        if (!node.isSelected) return null
        switch (node.variant) {
          case NodeVariant.Number: {
            return (
              <div key={node.id} className={styles.inputs}>
                <input
                  type='range'
                  name='Slider'
                  value={Number(node.value)}
                  onChange={(event) => handleSliderChange(event, node.id)}
                />
                <input
                  type='number'
                  name='Number'
                  value={Number(node.value)}
                  onChange={(event) => handleSliderChange(event, node.id)}
                />
              </div>
            )
          }
          case NodeVariant.Math: {
            return (
              <select
                key={node.id}
                name='Operations'
                onChange={(event) => handleSelectionChange(event, node.id)}
                value={node.mathOperation}
              >
                <option value={MathOperation.Addition}>addition</option>
                <option value={MathOperation.Subtraction}>subtraction</option>
                <option value={MathOperation.Multiplication}>
                  multiplication
                </option>
                <option value={MathOperation.Division}>division</option>
                <option value={MathOperation.Modulo}>modulo</option>
                <option value={MathOperation.Power}>power</option>
              </select>
            )
          }
        }
      })}
    </article>
  )
}
