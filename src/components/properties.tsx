'use client'

import { useGraph } from '@/contexts/graph.povider'
import { GraphActionTypes } from '@/enums/graph'
import styles from '@/styles/properties.module.css'
import { NodeProps } from '@/types/node'
import { ChangeEvent } from 'react'

export function Properties() {
  const { state, dispatch } = useGraph()

  function handleSliderChange(
    event: ChangeEvent<HTMLInputElement>,
    id: NodeProps['id']
  ) {
    dispatch({
      type: GraphActionTypes.NODE_SLIDER_CHANGE,
      payload: { event: event, id: id },
    })
  }
  return (
    <article className={styles.properties}>
      <h1 className={styles.title}>properties</h1>
      {state.nodes.map((node) => {
        if (node.selected) {
          switch (node.variant) {
            case 'integer':
              return (
                <div key={node.id} className={styles.input}>
                  <Slider
                    step={1}
                    value={node.value}
                    onRangeChange={(event) =>
                      handleSliderChange(event, node.id)
                    }
                  />
                  <Input
                    value={node.value}
                    onInputChange={(event) =>
                      handleSliderChange(event, node.id)
                    }
                  />
                </div>
              )
            case 'float':
              return (
                <div key={node.id} className={styles.input}>
                  <Slider
                    step={0.1}
                    value={node.value}
                    onRangeChange={(event) =>
                      handleSliderChange(event, node.id)
                    }
                  />
                  <Input
                    value={node.value}
                    onInputChange={(event) =>
                      handleSliderChange(event, node.id)
                    }
                  />
                </div>
              )
          }
        }
      })}
    </article>
  )
}

export function Slider({
  step,
  value: value,
  onRangeChange,
}: {
  step: number
  value: string | number | boolean | undefined
  onRangeChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      type='range'
      step={step}
      value={Number(value)}
      onChange={onRangeChange}
    />
  )
}

export function Input({
  value: value,
  onInputChange,
}: {
  value: string | number | boolean | undefined
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return <input value={Number(value)} onChange={onInputChange} />
}
