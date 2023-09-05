import type { PointerEvent } from 'react'

export interface PortProps {
  id: string
  value: number
  variant: PortVariant
  onPortPointerDown?: (
    event: PointerEvent<HTMLButtonElement>,
    id: string
  ) => void
  onPortPointerUp?: (event: PointerEvent<HTMLButtonElement>, id: string) => void
}

export enum PortVariant {
  Input = 'input',
  Output = 'output',
}
