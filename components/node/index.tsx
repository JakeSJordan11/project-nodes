"use client";

import type { PointerEvent } from "react";
import { useState, useRef } from "react";
import Port from "../ports";
import styles from "./styles.module.css";
import type { NodeProps } from "./types";

export default function Node({
  inputs,
  outputs,
  onPortPointerDown,
  onPortPointerOver,
  onPortPointerUp,
  portRef,
}: NodeProps) {
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const dynamicStyles = {
    top: nodePosition.y,
    left: nodePosition.x,
  };

  const [nodePointerDown, setNodePointerDown] = useState(false);
  const [portPointerDown, setPortPointerDown] = useState(false);
  const nodeOffsetPosition = useRef({ x: 0, y: 0 });

  function handleNodePointerDown(event: PointerEvent) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setNodePointerDown(true);
    nodeOffsetPosition.current = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().x,
      y: event.clientY - event.currentTarget.getBoundingClientRect().y,
    };
  }

  function handleNodePointerUp() {
    nodePointerDown && setNodePointerDown(false);
    portPointerDown && setPortPointerDown(false);
  }

  function handleNodePointerMove(event: PointerEvent) {
    // this works well I'm just not sure if this is the clearest way to do it
    nodePointerDown &&
      !portPointerDown &&
      setNodePosition({
        x: event.clientX - nodeOffsetPosition.current.x,
        y: event.clientY - nodeOffsetPosition.current.y,
      });
  }

  function handlePortPointerDown(event: PointerEvent<HTMLButtonElement>) {
    // using the onPointerDown prop in this scope and then passing the prop to allow it to be used as a Node prop in that scope as well
    setPortPointerDown(true);
    onPortPointerDown && onPortPointerDown(event);
  }

  return (
    <article
      className={styles.node}
      style={dynamicStyles}
      onPointerDown={handleNodePointerDown}
      onPointerUp={handleNodePointerUp}
      onPointerMove={handleNodePointerMove}
    >
      {inputs ? (
        <Port
          ref={portRef}
          input
          amount={inputs}
          onPointerDown={handlePortPointerDown}
          onPointerUp={onPortPointerUp}
          onPointerOver={onPortPointerOver}
        />
      ) : null}
      <h3> Node Content</h3>
      {outputs ? (
        <Port
          ref={portRef}
          output
          amount={outputs}
          onPointerDown={handlePortPointerDown}
          onPointerUp={onPortPointerUp}
          onPointerOver={onPortPointerOver}
        />
      ) : null}
    </article>
  );
}
