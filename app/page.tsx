"use client";

import type { PointerEvent } from "react";
import { useState } from "react";
import {
  initialNodes,
  initialPorts,
  initialStreams,
  Node,
  Port,
  Stream,
} from "../components/";
import styles from "./page.module.css";

export default function Page() {
  const [nodes, setNodes] = useState(initialNodes);
  const [ports, setPorts] = useState(initialPorts);
  const [streams, setStreams] = useState(initialStreams);
  const [cursor, setCursor] = useState("default");

  function handleMainPointerMove(event: PointerEvent) {
    const newNodes = nodes.map((node) => {
      if (node.isActive) {
        return {
          ...node,
          position: {
            x: event.clientX - node.offset.x,
            y: event.clientY - node.offset.y,
          },
        };
      }
      return { ...node };
    });
    setNodes(newNodes);
  }

  function handleMainPointerUp() {
    setCursor("default");
    setNodes(
      nodes.map((node) => {
        if (node) {
          return {
            ...node,
            isActive: false,
          };
        }
        return node;
      })
    );
    setStreams([
      ...streams
        .filter((stream) => stream.isLinked || stream.isActive)
        .map((stream) => {
          const streamSourceBounds = stream.source?.getBoundingClientRect();
          const streamTargetBounds = stream.target?.getBoundingClientRect();
          if (
            stream.isReadyToLink &&
            streamTargetBounds &&
            streamSourceBounds
          ) {
            setPorts(
              ports.map((port) => {
                if (
                  port.id === stream.source?.id ||
                  port.id === stream.target?.id
                ) {
                  return { ...port, isLinked: true };
                }
                return port;
              })
            );
            return {
              ...stream,
              d: `M ${streamSourceBounds.x + 8} ${streamSourceBounds.y + 8} 
              L ${streamTargetBounds.x + 8} ${streamTargetBounds.y + 8}`,
              isLinked: true,
              isActive: false,
              isReadyToLink: false,
              stroke: "teal",
            };
          } else if (stream.isActive) {
            return {
              ...stream,
              isActive: false,
              isReadyToLink: false,
            };
          }
          return { ...stream, isActive: false, isReadyToLink: false };
        }),
    ]);
  }

  function handlePortPointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setCursor("move");
    const buttonBounds = event.currentTarget.getBoundingClientRect();
    const port = ports.find(
      (port) => port.id?.toString() === event.currentTarget.id
    );

    !port?.isLinked &&
      setStreams([
        ...streams,
        {
          id: `stream-${streams.length}`,
          isActive: true,
          isLinked: false,
          isReadyToLink: false,
          source: event.currentTarget,
          target: null,
          d: `M ${buttonBounds.x + 8} ${buttonBounds.y + 8}`,
          stroke: "blue",
        },
      ]);
  }

  function handlePortPointerEnter(event: PointerEvent) {
    const targetPort = ports.find(
      (port) => port.id?.toString() === event.currentTarget.id
    );
    const sourcePort = ports.find(
      (port) =>
        port.id?.toString() ===
        streams.find((stream) => stream.isActive)?.source?.id
    );
    const isPortLinked = targetPort?.isLinked;

    setStreams([
      ...streams.map((stream) => {
        if (
          stream.isActive &&
          sourcePort?.type !== targetPort?.type &&
          sourcePort?.parentId !== targetPort?.parentId &&
          !isPortLinked
        ) {
          return {
            ...stream,
            isReadyToLink: (stream.isReadyToLink = true),
            target: (stream.target = event.currentTarget as HTMLButtonElement),
          };
        }
        if (
          (stream.isActive && sourcePort?.parentId === targetPort?.parentId) ||
          (stream.isActive && sourcePort?.type === targetPort?.type) ||
          (stream.isActive && isPortLinked)
        ) {
          return { ...stream, stroke: (stream.stroke = "darkred") };
        }
        return stream;
      }),
    ]);
  }

  function handlePortPointerLeave() {
    setStreams(
      streams.map((stream) => {
        if (stream.isActive) {
          return {
            ...stream,
            isReadyToLink: (stream.isReadyToLink = false),
            stroke: (stream.stroke = "blue"),
          };
        }
        return stream;
      })
    );
  }

  function handleNodePointerDown(event: PointerEvent) {
    const nodeBounds = event.currentTarget.getBoundingClientRect();
    setNodes(
      nodes.map((node) => {
        if (node.id === event.currentTarget.id) {
          return {
            ...node,
            isActive: true,
            offset: {
              x: event.clientX - nodeBounds.x,
              y: event.clientY - nodeBounds.y,
            },
          };
        }
        return node;
      })
    );
  }

  return (
    <main
      className={styles.main}
      style={{ cursor: cursor }}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      {nodes.map((node) => (
        <Node key={node.id} onPointerDown={handleNodePointerDown} {...node}>
          <div className={styles.portContainer} style={{ top: 0 }}>
            {ports.map((port) => {
              if (port.type === "input" && port.parentId === node.id) {
                return (
                  <Port
                    key={port.id}
                    onPointerDown={handlePortPointerDown}
                    onPointerEnter={handlePortPointerEnter}
                    onPointerLeave={handlePortPointerLeave}
                    {...port}
                  />
                );
              }
            })}
          </div>
          <p className={styles.nodeTitle}>{node.title}</p>
          <div className={styles.portContainer} style={{ bottom: 0 }}>
            {ports.map((port) => {
              if (port.type === "output" && port.parentId === node.id) {
                return (
                  <Port
                    key={port.id}
                    onPointerDown={handlePortPointerDown}
                    onPointerEnter={handlePortPointerEnter}
                    onPointerLeave={handlePortPointerLeave}
                    {...port}
                  />
                );
              }
            })}
          </div>
        </Node>
      ))}
      {streams.map((stream) => (
        <Stream key={stream.id} {...stream} stroke="green" />
      ))}
    </main>
  );
}
