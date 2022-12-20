"use client";

import styles from "./styles.module.css";
import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import Connector from "../connector";
import Node from "../node";

export default function Canvas() {
  const [portPointerDown, setPortPointerDown] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<EventTarget & Element>();
  const portRef = useRef<HTMLButtonElement>(null);
  const [currentPath, setCurrentPath] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const nodeRef = useRef<HTMLDivElement>(null);

  function handlePortPointerDown(event: PointerEvent) {
    setPortPointerDown(true);
    setCurrentPath({
      x1: event.currentTarget.getBoundingClientRect().x + 8,
      y1: event.currentTarget.getBoundingClientRect().y + 8,
      x2: event.currentTarget.getBoundingClientRect().x + 8,
      y2: event.currentTarget.getBoundingClientRect().y + 8,
    });
  }

  function handleMainPointerUp() {
    portPointerDown && setPortPointerDown(false);
    hoveredPort &&
      setCurrentPath({
        ...currentPath,
        x2: hoveredPort.getBoundingClientRect().x + 8,
        y2: hoveredPort.getBoundingClientRect().y + 8,
      });
  }

  function handleMainPointerMove(event: PointerEvent) {
    portPointerDown &&
      setCurrentPath({
        ...currentPath,
        x2: event.clientX,
        y2: event.clientY,
      });
  }

  function handlePortPointerOver(event: PointerEvent) {
    portPointerDown && setHoveredPort(event.currentTarget);
  }

  function handlePortPointerUp() {
    portPointerDown && setPortPointerDown(false);
    hoveredPort &&
      setCurrentPath({
        ...currentPath,
        x2: hoveredPort.getBoundingClientRect().x + 8,
        y2: hoveredPort.getBoundingClientRect().y + 8,
      });
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      <Node
        portRef={portRef}
        nodeRef={nodeRef}
        outputs={1}
        onPortPointerDown={handlePortPointerDown}
        onPortPointerOver={handlePortPointerOver}
        onPortPointerUp={handlePortPointerUp}
      />
      <Node
        portRef={portRef}
        nodeRef={nodeRef}
        inputs={1}
        onPortPointerDown={handlePortPointerDown}
        onPortPointerOver={handlePortPointerOver}
        onPortPointerUp={handlePortPointerUp}
      />
      <Connector currentPath={currentPath} />
    </main>
  );
}
