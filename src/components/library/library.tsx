'use client'

import styled from 'styled-components'
import { NodeVariant } from '../node'

const StyledLibrary = styled.article`
  grid-area: library;
  display: grid;
  grid-auto-flow: column;
  gap: 1rem;
  overflow-x: scroll;
  margin-inline: -1rem;
  padding-inline: 1rem;
  padding-block-end: 1rem;
  justify-content: start;
`

const StyledItem = styled.article`
  height: 6rem;
  padding: 1ch;
  text-align: center;
  background-color: hsla(0, 0%, 90%, 1);
  box-shadow: 4px 4px 4px 1px hsla(0, 0%, 0%, 0.33);
  border: 0.125rem solid hsla(0, 0%, 50%, 1);
  border-radius: 8px;
  user-select: none;
  aspect-ratio: 1;
`
export function Library() {
  function handleonDragStart(
    event: React.DragEvent<HTMLElement>,
    node: string
  ) {
    event.dataTransfer.setData('node', node)
  }
  return (
    <StyledLibrary>
      {Array(NodeVariant.Number, NodeVariant.Math).map((node) => (
        <StyledItem
          key={node}
          draggable={true}
          onDragStart={(event) => handleonDragStart(event, node)}
        >
          {node}
        </StyledItem>
      ))}
    </StyledLibrary>
  )
}
