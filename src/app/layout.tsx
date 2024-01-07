'use client'

import { GraphProvider } from '@/components/graph'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { inter } from './fonts'
import StyledComponentsRegistry from './registry'

const StyledBody = styled.body`
  margin: 0;
  overflow: hidden;
`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={inter.className} lang='en'>
      <StyledBody>
        <GraphProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </GraphProvider>
      </StyledBody>
    </html>
  )
}
