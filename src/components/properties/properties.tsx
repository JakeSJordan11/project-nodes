'use client'

import { type ChangeEvent } from 'react'
import { GraphActionTypes, useGraph } from '../graph'
import { NodeStatus, NodeVariant, type NodeProps } from '../node'
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

  function handleSelectionChange(event: ChangeEvent<HTMLSelectElement>) {
    dispatch({
      type: GraphActionTypes.MATH_NODE_OPERATION_CHANGE,
      payload: { event: event },
    })
  }

  return (
    <article className={styles.properties}>
      <h1 className={styles.title}>properties</h1>
      {state.nodes.map((node) => {
        if (
          node.status === NodeStatus.Idle ||
          node.status === NodeStatus.Dragging
        ) {
          return undefined
        }
        switch (node.variant) {
          case NodeVariant.Number: {
            return (
              <div key={node.id} className={styles.inputs}>
                <input
                  type='range'
                  value={Number(node.value)}
                  onChange={(event) => handleSliderChange(event, node.id)}
                />
                <input
                  type='number'
                  value={Number(node.value)}
                  onChange={(event) => handleSliderChange(event, node.id)}
                />
              </div>
            )
          }
          case NodeVariant.Math: {
            return (
              <select key={node.id} onChange={handleSelectionChange}>
                <option value='+'>addition</option>
                <option value='-'>subtraction</option>
                <option value='*'>multiplication</option>
                <option value='/'>division</option>
              </select>
            )
          }
        }
      })}
    </article>
  )
}