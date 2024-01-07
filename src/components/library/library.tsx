'use client'

import styled from 'styled-components'
import { NodeVariant } from '../node'

export function Library() {
  function handleonDragStart(
    event: React.DragEvent<HTMLElement>,
    node: string
  ) {
    event.dataTransfer.setData('node', node)
  }

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
    background-color: var(--color-background-primary);
    box-shadow: var(--drop-shadow);
    border: var(--width-border) solid;
    border-color: var(--color-border);
    border-radius: var(--radii-border-large);
    user-select: none;
    aspect-ratio: 1;
  `

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
