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
          case NodeVariant.WebGPU: {
            return (
              <div key={node.id} className={styles.inputs}>
                <label>Translation</label>
                <div>
                  <label>X: </label>
                  <input
                    type='range'
                    name='translationX'
                    min='0'
                    max='300'
                    value={node.translationX}
                    onChange={(event) =>
                      dispatch({
                        type: GraphActionTypes.TRANSLATION_X_CHANGE,
                        payload: {
                          event: event,
                          id: node.id,
                        },
                      })
                    }
                  />
                  <div>
                    <label>Y: </label>
                    <input
                      type='range'
                      name='translationY'
                      min='0'
                      max='300'
                      value={node.translationY}
                      onChange={(event) =>
                        dispatch({
                          type: GraphActionTypes.TRANSLATION_Y_CHANGE,
                          payload: {
                            event: event,
                            id: node.id,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <label>Rotation</label>
                <input
                  type='range'
                  name='rotation'
                  min='-360'
                  max='360'
                  value={node.rotation}
                  onChange={(event) =>
                    dispatch({
                      type: GraphActionTypes.ROTATION_CHANGE,
                      payload: {
                        event: event,
                        id: node.id,
                      },
                    })
                  }
                />
                <label>Scale</label>
                <div>
                  <label>X: </label>
                  <input
                    type='range'
                    name='scaleX'
                    min='-2'
                    max='2'
                    step='0.1'
                    value={node.scaleX}
                    onChange={(event) =>
                      dispatch({
                        type: GraphActionTypes.SCALE_X_CHANGE,
                        payload: {
                          event: event,
                          id: node.id,
                        },
                      })
                    }
                  />
                  <div>
                    <label>Y: </label>
                    <input
                      type='range'
                      name='scaleY'
                      min='-2'
                      max='2'
                      step='0.01'
                      value={node.scaleY}
                      onChange={(event) =>
                        dispatch({
                          type: GraphActionTypes.SCALE_Y_CHANGE,
                          payload: {
                            event: event,
                            id: node.id,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <label>Color</label>
                <div>
                  <label>R: </label>
                  <input
                    type='range'
                    name='red'
                    min='0'
                    max='1'
                    step='0.01'
                    value={node.color.r}
                    onChange={(event) =>
                      dispatch({
                        type: GraphActionTypes.COLOR_R_CHANGE,
                        payload: {
                          event: event,
                          id: node.id,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label>G: </label>
                  <input
                    type='range'
                    name='green'
                    min='0'
                    max='1'
                    step='0.01'
                    value={node.color.g}
                    onChange={(event) =>
                      dispatch({
                        type: GraphActionTypes.COLOR_G_CHANGE,
                        payload: {
                          event: event,
                          id: node.id,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label>B: </label>
                  <input
                    type='range'
                    name='blue'
                    min='0'
                    max='1'
                    step='0.01'
                    value={node.color.b}
                    onChange={(event) =>
                      dispatch({
                        type: GraphActionTypes.COLOR_B_CHANGE,
                        payload: {
                          event: event,
                          id: node.id,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label>A: </label>
                  <input
                    type='range'
                    name='alpha'
                    min='0'
                    max='1'
                    step='0.01'
                    value={node.color.a}
                    onChange={(event) =>
                      dispatch({
                        type: GraphActionTypes.COLOR_A_CHANGE,
                        payload: {
                          event: event,
                          id: node.id,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )
          }
        }
      })}
    </article>
  )
}
