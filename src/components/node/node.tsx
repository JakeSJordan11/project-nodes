'use client'

import { useEffect, type PointerEvent } from 'react'
import styled from 'styled-components'
import { GraphActionTypes, useGraph } from '../graph'
import { Port, PortKind, type PortProps } from '../port'

export enum NodeKind {
  Input = 'input',
  Operator = 'operator',
}

export enum NodeVariant {
  Math = 'math',
  Number = 'number',
}

export enum NodeStatus {
  Idle = 'idle',
  Active = 'active',
}

export interface NodeProps {
  id: string | undefined
  value: number | boolean | string | undefined
  kind: NodeKind
  variant: NodeVariant
  position: { x: number; y: number }
  offset: { x: number; y: number }
  status: NodeStatus
  ports: PortProps[]
  selected?: boolean
}

const StyledNode = styled.article<{ position: { x: number; y: number } }>`
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
  box-shadow: 4px 4px 4px 1px hsla(0, 0%, 0%, 0.33);
  border: 0.125rem solid hsla(0, 0%, 50%, 1);
  border-radius: 0.5rem;
  background-color: hsla(0, 0%, 90%, 1);
  padding: 0.75rem;
  height: 8rem;
  aspect-ratio: 1;
  user-select: none;
  top: ${(props) => props.position.y}px;
  left: ${(props) => props.position.x}px;
`

const StyledPortWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  justify-content: space-evenly;
  align-items: center;
  width: 0;
  height: '100%';
`

const StyledInputs = styled(StyledPortWrapper)`
  left: 0;
`

const StyledOutputs = styled(StyledPortWrapper)`
  right: 0;
`

const StyledTitle = styled.h1`
  margin: 0;
  width: 100%;
  font-weight: 800;
  font-size: medium;
  text-align: center;
`

const StyledValue = styled.output`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 100%;
  aspect-ratio: 1;
  font-weight: 800;
  font-size: x-large;
  user-select: none;
`

export function Node({ id, value, position, variant, ports }: NodeProps) {
  const { dispatch } = useGraph()

  useEffect(() => {
    dispatch({
      type: GraphActionTypes.NODE_VALUE_CHANGE,
      payload: { value: value, id: id },
    })
  }, [value, id, dispatch])

  function handleMouseDown(event: PointerEvent<HTMLButtonElement>) {
    dispatch({
      type: GraphActionTypes.NODE_MOUSE_DOWN,
      payload: { event: event, id: id },
    })
  }

  function handleClick() {
    dispatch({
      type: GraphActionTypes.NODE_CLICK,
      payload: { id: id },
    })
  }

  return (
    <StyledNode
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      position={position}
    >
      {ports.filter((port) => port.kind === PortKind.Input).length <
      1 ? null : (
        <StyledInputs>
          {ports.map((port) =>
            port.kind !== PortKind.Input ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </StyledInputs>
      )}
      <StyledTitle>{variant}</StyledTitle>
      <StyledValue>{value}</StyledValue>
      {ports.filter((port) => port.kind === PortKind.Output).length <
      1 ? null : (
        <StyledOutputs>
          {ports.map((port) =>
            port.kind !== PortKind.Output ? null : (
              <Port {...port} key={port.id} />
            )
          )}
        </StyledOutputs>
      )}
    </StyledNode>
  )
}
