"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import Port from "../ports";
import styles from "./styles.module.css";
import type { NodeProps } from "./types";

export default function Node({
  inputs,
  outputs,
  onPortPointerDown,
  onPortPointerEnter,
  onPortPointerLeave,
  onPortPointerUp,
}: NodeProps) {
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const dynamicStyles = {
    top: nodePosition.y,
    left: nodePosition.x,
  };

  const isNodePointerDown = useRef(false);
  const isPortPointerDown = useRef(false);
  const nodeOffsetPosition = useRef({ x: 0, y: 0 });

  function handleNodePointerDown(event: PointerEvent) {
    /* event.currentTarget.setPointerCapture(event.pointerId); */
    isNodePointerDown.current = true;
    nodeOffsetPosition.current = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().x,
      y: event.clientY - event.currentTarget.getBoundingClientRect().y,
    };
  }

  function handleNodePointerUp() {
    isNodePointerDown.current && (isNodePointerDown.current = false);
    isPortPointerDown.current && (isPortPointerDown.current = false);
  }

  function handleNodePointerMove(event: PointerEvent) {
    // this works well I'm just not sure if this is the clearest way to do it
    isNodePointerDown.current &&
      !isPortPointerDown.current &&
      setNodePosition({
        x: event.clientX - nodeOffsetPosition.current.x,
        y: event.clientY - nodeOffsetPosition.current.y,
      });
  }

  function handlePortPointerDown(event: PointerEvent<HTMLButtonElement>) {
    // using the onPointerDown prop in this scope and then passing the prop to allow it to be used as a Node prop in that scope as well
    isPortPointerDown.current = true;
    onPortPointerDown && onPortPointerDown(event);
  }

  useEffect(() => {
    window.addEventListener("pointermove", handleNodePointerMove as any); // typescripts broken I don't want to make a global.d.ts file for the globalThis on the window
    return () => {
      window.removeEventListener("pointermove", handleNodePointerMove as any);
    };
  }, []);

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
          input
          amount={inputs}
          onPointerDown={handlePortPointerDown}
          onPointerUp={onPortPointerUp}
          onPointerEnter={onPortPointerEnter}
          onPointerLeave={onPortPointerLeave}
        />
      ) : null}
      <h3> Node Content</h3>
      {outputs ? (
        <Port
          output
          amount={outputs}
          onPointerDown={handlePortPointerDown}
          onPointerUp={onPortPointerUp}
          onPointerEnter={onPortPointerEnter}
          onPointerLeave={onPortPointerLeave}
        />
      ) : null}
    </article>
  );
}
