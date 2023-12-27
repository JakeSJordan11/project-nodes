import { PointerEventHandler } from 'react'

export interface ContextMenuState {
  graph: {
    position: { x: number; y: number }
    hidden: boolean
  }
  node: {
    position: { x: number; y: number }
    hidden: boolean
    id: string | undefined
  }
}

export interface ContextMenuProps extends ContextMenuState {
  onItemPointerDown?: PointerEventHandler<HTMLButtonElement>
}
