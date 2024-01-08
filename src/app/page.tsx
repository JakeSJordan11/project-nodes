'use client'

import { Graph } from '@/components/graph'
import { Library } from '@/components/library'
import { Output } from '@/components/output'
import { Properties } from '@/components/properties'
import styled from 'styled-components'

const StyledPage = styled.main`
  box-sizing: border-box;
  display: grid;
  grid-template-areas:
    'graph output'
    'graph properties'
    'library properties';
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  padding: 1rem;
  height: 100svh;
  background-color: hsla(0, 0%, 100%, 1);
`

export default function Home() {
  return (
    <StyledPage>
      <Graph />
      <Library />
      <Output />
      <Properties />
    </StyledPage>
  )
}
