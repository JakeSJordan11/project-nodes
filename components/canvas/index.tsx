"use client";

import styles from "./styles.module.css";
import { useState } from "react";
import type { PointerEvent } from "react";
import Connector from "../connector";
import { Node } from "../nodes";
import type { CurrentPath } from "./types";
import Svg from "../svg";
import { initialNodeData } from "../../utils/data";
import { NodeData } from "../../utils/types";

export default function Canvas() {
  const [data, setData] = useState<NodeData[]>(initialNodeData);
  const [dragging, setDragging] = useState(false);
  const [currentPath, setCurrentPath] = useState<CurrentPath>();
  const [cursor, setCursor] = useState("default");

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
      <Svg>
        {currentPath && (
          <Connector
            d={`M${currentPath.x1} ${currentPath.y1} L${currentPath.x2} ${currentPath.y2}`}
          />
        )}
      </Svg>
    </main>
  );
}
