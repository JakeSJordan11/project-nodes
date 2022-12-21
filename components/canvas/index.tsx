"use client";

import styles from "./styles.module.css";
import { useState } from "react";
import type { PointerEvent } from "react";
import Connector from "../connector";
import Node from "../node";

export default function Canvas() {
  const [portPointerDown, setPortPointerDown] = useState(false);
  const [currentPath, setCurrentPath] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const [cursor, setCursor] = useState("default");
  const dynamicStyles = {
    cursor: cursor,
  };

  function handlePortPointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setCursor("move");
    setPortPointerDown(true);
    setCurrentPath({
      x1: event.currentTarget.getBoundingClientRect().x + 8,
      y1: event.currentTarget.getBoundingClientRect().y + 8,
      x2: event.currentTarget.getBoundingClientRect().x + 8,
      y2: event.currentTarget.getBoundingClientRect().y + 8,
    });
  }

  function handlePortPointerUp() {
    setPortPointerDown(false);
  }

  function handleMainPointerMove(event: PointerEvent) {
    portPointerDown &&
      setCurrentPath({
        ...currentPath,
        x2: event.clientX,
        y2: event.clientY,
      });
  }

  function handleMainPointerUp() {
    setCursor("unset");
    setPortPointerDown(false);
  }

  return (
    <main
      className={styles.main}
      style={dynamicStyles}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      <Node
        outputs={1}
        onPortPointerDown={handlePortPointerDown}
        onPortPointerUp={handlePortPointerUp}
      />
      <Node
        inputs={1}
        onPortPointerDown={handlePortPointerDown}
        onPortPointerUp={handlePortPointerUp}
      />
      <Connector currentPath={currentPath} />
    </main>
  );
}
