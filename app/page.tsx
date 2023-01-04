"use client";

import type { PointerEvent } from "react";
import { useState } from "react";
import Connector from "../components/connector";
import { Node } from "../components/nodes";
import { initialNodeData } from "../utils/data";
import type { NodeData } from "../utils/types";
import styles from "./page.module.css";

export default function Page() {
  const [data, setData] = useState<NodeData[]>(initialNodeData);
  const [dragging, setDragging] = useState(false);
  const [currentPath, setCurrentPath] = useState<{
    x1?: number;
    y1?: number;
    x2: number;
    y2: number;
  }>();
  const [cursor, setCursor] = useState("default");
  const [paths, setPaths] = useState<{
    [key: string]: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
  }>({});

  const dynamicStyles = {
    cursor: cursor,
  };

  function handlePortPointerDown(event: PointerEvent<HTMLButtonElement>) {
    setCursor("move");
    event.stopPropagation();
    setDragging(true);
    setCurrentPath({
      x1: event.currentTarget.getBoundingClientRect().x + 8,
      y1: event.currentTarget.getBoundingClientRect().y + 8,
      x2: event.currentTarget.getBoundingClientRect().x + 8,
      y2: event.currentTarget.getBoundingClientRect().y + 8,
    });
  }

  function handleMainPointerMove(event: PointerEvent) {
    if (dragging) {
      setCurrentPath({
        ...currentPath,
        x2: event.clientX,
        y2: event.clientY,
      });
    }
  }

  function handleMainPointerUp() {
    setCursor("unset");
    setDragging(false);
    setCurrentPath(undefined);
  }

  function handlePortPointerOver() {}

  function handlePortPointerLeave() {}

  return (
    <main
      className={styles.main}
      style={dynamicStyles}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      {data.map((node) => (
        <Node
          key={node.id}
          id={node.id}
          type={node.type}
          title={node.title}
          position={node.position}
          ports={node.ports.map((port) => ({
            id: port.id,
            type: port.type,
            connectedTo: port.connectedTo,
          }))}
          onPortPointerDown={handlePortPointerDown}
          onPortPointerOver={handlePortPointerOver}
          onPortPointerLeave={handlePortPointerLeave}
        />
      ))}
      <svg
        preserveAspectRatio="xMinYMin meet"
        height={"100%"}
        width={"100%"}
        className={styles.connectors}
      >
        {currentPath && (
          <Connector
            d={`M${currentPath.x1} ${currentPath.y1} L${currentPath.x2} ${currentPath.y2}`}
          />
        )}
      </svg>
    </main>
  );
}
