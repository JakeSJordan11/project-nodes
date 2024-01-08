'use client'

import styled from 'styled-components'
import { useGraph } from '../graph'

const StyledOutput = styled.article`
  grid-area: output;
  background-color: hsla(0, 0%, 90%, 1);
  box-shadow: 4px 4px 4px 1px hsla(0, 0%, 0%, 0.33);
  border: 2px solid hsla(0, 0%, 50%, 1);
  border-radius: 8px;
  min-width: 18rem;
  aspect-ratio: 1;
  display: grid;
  place-content: center;
`

const StyledValue = styled.h1`
  margin: 0;
`

export function Output() {
  const { state } = useGraph()
  return (
    <StyledOutput>
      {state.nodes.map((node) => {
        if (!node.selected) return null
        return <StyledValue key={node.id}>{node.value}</StyledValue>
      })}
    </StyledOutput>
  )
}
