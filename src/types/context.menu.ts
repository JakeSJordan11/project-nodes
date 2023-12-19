import { Coordinate, Id } from '@/types/utils'
import { PointerEventHandler } from 'react'

export interface ContextMenuState {
  graph: {
    position: Coordinate
    hidden: boolean
  }
  node: {
    position: Coordinate
    hidden: boolean
    id: Id
  }
}

export interface ContextMenuProps extends ContextMenuState {
  onItemPointerDown?: PointerEventHandler<HTMLButtonElement>
}
