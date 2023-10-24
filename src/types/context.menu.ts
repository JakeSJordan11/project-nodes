import { Coordinate } from '@/types/utils'
import { PointerEvent, PointerEventHandler } from 'react'

export interface ContextMenuProps {
  position: Coordinate
  status: ContextMenuStatus
  onItemPointerDown: PointerEventHandler<HTMLButtonElement>
}

export enum ContextMenuStatus {
  Visible = 'visible',
  Hidden = 'hidden',
}
