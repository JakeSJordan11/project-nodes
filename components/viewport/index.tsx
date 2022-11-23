"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import Connector from "../connector";
import Node from "../node";

export default function Viewport() {
  const isPortPointerDown = useRef(false);
  const [isPortPointerOver, setIsPortPointerOver] = useState(false);
  const [currentPath, setCurrentPath] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  function handlePortPointerDown(event: PointerEvent) {
    isPortPointerDown.current = true;
    setCurrentPath({
      x1: event.currentTarget.getBoundingClientRect().x + 8,
      y1: event.currentTarget.getBoundingClientRect().y + 8,
      x2: event.currentTarget.getBoundingClientRect().x + 8,
      y2: event.currentTarget.getBoundingClientRect().y + 8,
    });
  }

  function handleMainPointerUp() {
    isPortPointerDown.current && (isPortPointerDown.current = false);
  }

  function handleMainPointerMove(event: PointerEvent) {
    if (isPortPointerDown.current) {
      setCurrentPath({
        ...currentPath,
        x2: event.clientX,
        y2: event.clientY,
      });
    }
  }

  function handlePortPointerEnter() {
    setIsPortPointerOver(true);
  }

  function handlePortPointerLeave() {
    setIsPortPointerOver(false);
  }

  return (
    <main
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      <Node
        outputs={1}
        onPortPointerDown={handlePortPointerDown}
        onPortPointerEnter={handlePortPointerEnter}
        onPortPointerLeave={handlePortPointerLeave}
      />
      <Node
        inputs={1}
        onPortPointerDown={handlePortPointerDown}
        onPortPointerEnter={handlePortPointerEnter}
        onPortPointerLeave={handlePortPointerLeave}
      />

      <Connector currentPath={currentPath} />
    </main>
  );
}
