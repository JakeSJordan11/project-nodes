'use client'

import { type ChangeEvent } from 'react'
import styled from 'styled-components'
import { GraphActionTypes, useGraph } from '../graph'
import { NodeVariant, type NodeProps } from '../node'

const StyledProperties = styled.article`
  grid-area: properties;
  background-color: hsla(0, 0%, 90%, 1);
  box-shadow: 4px 4px 4px 1px hsla(0, 0%, 0%, 0.33);
  border: 0.125rem solid hsla(0, 0%, 50%, 1);
  border-radius: 0.5rem;
  user-select: none;
  text-align: center;
`

const StyledTitle = styled.h1`
  font-size: 1.2rem;
`

const StyledInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

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

  function handleSelectionChange(event: ChangeEvent<HTMLSelectElement>) {
    dispatch({
      type: GraphActionTypes.NODE_SELECTION_CHANGE,
      payload: { event: event },
    })
  }

  return (
    <StyledProperties>
      <StyledTitle>properties</StyledTitle>
      {state.nodes.map((node) => {
        if (!node.selected) return null
        switch (node.variant) {
          case NodeVariant.Number: {
            return (
              <StyledInput>
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
              </StyledInput>
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
          default: {
            return null
          }
        }
      })}
    </StyledProperties>
  )
}
