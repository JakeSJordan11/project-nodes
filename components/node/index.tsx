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
  onPortPointerUp,
}: NodeProps) {
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const nodeOffsetPosition = useRef({ x: 0, y: 0 });
  const [nodePointerDown, setNodePointerDown] = useState(false);

  const dynamicStyles = {
    top: nodePosition.y,
    left: nodePosition.x,
  };

  function handleNodePointerDown(event: PointerEvent) {
    // this allows draggin nodes freely
    event.currentTarget.setPointerCapture(event.pointerId);

    setNodePointerDown(true);
    nodeOffsetPosition.current = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().x,
      y: event.clientY - event.currentTarget.getBoundingClientRect().y,
    };
  }

  function handleNodePointerUp() {
    nodePointerDown && setNodePointerDown(false);
  }

  function handleNodePointerMove(event: PointerEvent) {
    nodePointerDown &&
      setNodePosition({
        x: event.clientX - nodeOffsetPosition.current.x,
        y: event.clientY - nodeOffsetPosition.current.y,
      });
  }

  return (
    <article
      className={styles.node}
      style={dynamicStyles}
      onPointerDown={handleNodePointerDown}
      onPointerUp={handleNodePointerUp}
      onPointerMove={handleNodePointerMove}
    >
      <Port
        input
        amount={inputs || 0}
        onPointerDown={onPortPointerDown}
        onPointerUp={onPortPointerUp}
      />
      <h3> Node Content</h3>
      <Port
        output
        amount={outputs || 0}
        onPointerDown={onPortPointerDown}
        onPointerUp={onPortPointerUp}
      />
    </article>
  );
}
