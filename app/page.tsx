"use client";

import type { PointerEvent } from "react";
import { useState } from "react";
import { Node } from "../components/node";
import { Stream } from "../components/stream";
import { initialNodes } from "../components/node/node.data";
import { initialPorts } from "../components/port/port.data";
import { initialStreams } from "../components/stream/stream.data";
import styles from "./page.module.css";

export default function Page() {
  const [nodes, setNodes] = useState(initialNodes);
  const [ports, setPorts] = useState(initialPorts);
  const [streams, setStreams] = useState(initialStreams);
  const [cursor, setCursor] = useState("default");

  function handlePortPointerDown(event: PointerEvent) {
    const buttonBounds = event.currentTarget.getBoundingClientRect();
    event.stopPropagation();
    setCursor("move");
    setStreams([
      ...streams,
      {
        isActive: true,
        isLinked: false,
        m: `M ${buttonBounds.x + 8} ${buttonBounds.y + 8}`,
      },
    ]);
  }

  function handleMainPointerMove(event: PointerEvent) {
    setStreams(
      streams.map((stream) => {
        if (stream.isActive) {
          return {
            ...stream,
            m: stream.m,
            l: `L ${event.clientX} ${event.clientY}`,
          };
        }
        return stream;
      })
    );
    setNodes(
      nodes.map((node) => {
        if (node.isActive) {
          return {
            ...node,
            nodePosition: {
              x: event.clientX - node.nodeOffset.x,
              y: event.clientY - node.nodeOffset.y,
            },
          };
        }
        return node;
      })
    );
  }

  function handleNodePointerDown(event: PointerEvent) {
    setNodes(
      nodes.map((node) => {
        if (node.nodeId.toString() === event.currentTarget.id) {
          return {
            ...node,
            isActive: true,
            nodeOffset: {
              x: event.clientX - event.currentTarget.getBoundingClientRect().x,
              y: event.clientY - event.currentTarget.getBoundingClientRect().y,
            },
          };
        }
        return node;
      })
    );
  }

  function handleMainPointerUp() {
    setCursor("default");
    setNodes(
      nodes.map((node) => {
        if (node.isActive) {
          return {
            ...node,
            isActive: false,
          };
        }
        return node;
      })
    );
    setStreams(
      streams.map((stream) => {
        if (stream.isActive && !stream.isLinked) {
          return {};
        }
        return stream;
      })
    );
  }

  function handlePortPointerOver() {}

  function handlePortPointerLeave() {}

  return (
    <main
      className={styles.main}
      style={{ cursor: cursor }}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      {nodes.map((node) => (
        <Node
          {...node}
          key={node.nodeId}
          onPointerDown={handleNodePointerDown}
          ports={ports.filter((port) => port.nodeId === node.nodeId)}
          portProps={{
            onPointerDown: handlePortPointerDown,
            onPointerOver: handlePortPointerOver,
            onPointerLeave: handlePortPointerLeave,
          }}
        />
      ))}
      <svg
        preserveAspectRatio="xMinYMin meet"
        height={"100%"}
        width={"100%"}
        className={styles.streams}
      >
        {streams.map(
          (stream, index) =>
            stream.m &&
            stream.l && (
              <Stream key={index} stroke="red" d={stream.m + stream.l} />
            )
        )}
      </svg>
    </main>
  );
}
