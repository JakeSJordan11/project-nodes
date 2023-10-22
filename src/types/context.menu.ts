import { Coordinate } from '@/types/utils'
import { PointerEvent } from 'react'

export interface ContextMenuProps {
  position: Coordinate
  status?: ContextMenuStatus
  onItemPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
}

export enum ContextMenuStatus {
  Visible = 'visible',
  Hidden = 'hidden',
}
