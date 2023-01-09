"use client";

import type { PointerEvent } from "react";
import { useState } from "react";
import { Node } from "../components/node";
import { initialNodes } from "../components/node/node.data";
import { Port } from "../components/port";
import { initialPorts } from "../components/port/port.data";
import { Stream } from "../components/stream";
import type { StreamData } from "../components/stream/stream.types";
import styles from "./page.module.css";

export default function Page() {
  const [nodes, setNodes] = useState(initialNodes);
  const [ports, setPorts] = useState(initialPorts);
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [cursor, setCursor] = useState("default");

  function handleMainPointerMove(event: PointerEvent) {
    setNodes(
      nodes.map((node) => {
        if (node.isActive && node.offset) {
          return {
            ...node,
            position: {
              x: event.clientX - node.offset.x,
              y: event.clientY - node.offset.y,
            },
          };
        }
        return node;
      })
    );
    setStreams([
      ...streams.map((stream) => {
        if (stream.isLinked && stream.source && stream.target) {
          return {
            ...stream,
            m: `M ${stream.source.getBoundingClientRect().x + 8} ${
              stream.source.getBoundingClientRect().y + 8
            }`,
            l: `L ${stream.target.getBoundingClientRect().x + 8} ${
              stream.target.getBoundingClientRect().y + 8
            }`,
          };
        }
        if (stream.isActive) {
          return {
            ...stream,
            m: stream.m,
            l: `L ${event.clientX} ${event.clientY}`,
          };
        }
        return stream;
      }),
    ]);
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
              ports.map((port) =>
                port.id?.toString() === stream.source?.id ||
                port.id?.toString() === stream.target?.id
                  ? {
                      ...port,
                      isLinked: true,
                    }
                  : port
              )
            );
            return {
              ...stream,
              m: `M ${streamSourceBounds.x + 8} ${streamSourceBounds.y + 8}`,
              l: `L ${streamTargetBounds.x + 8} ${streamTargetBounds.y + 8}`,
              isLinked: true,
              isActive: false,
              isReadyToLink: false,
              color: "teal",
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

  function handlePortPointerDown(event: PointerEvent) {
    const buttonBounds = event.currentTarget.getBoundingClientRect();
    event.stopPropagation();
    setCursor("move");
    const sourcePort = ports.find(
      (port) => port.id?.toString() === event.currentTarget.id
    );

    !sourcePort?.isLinked &&
      setStreams([
        ...streams,
        {
          isActive: true,
          m: `M ${buttonBounds.x + 8} ${buttonBounds.y + 8}`,
          source: event.currentTarget as HTMLButtonElement,
          color: "blue",
        },
      ]);
  }

  function handlePortPointerOver(event: PointerEvent) {
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
          sourcePort?.io !== targetPort?.io &&
          sourcePort?.nodeId !== targetPort?.nodeId &&
          !isPortLinked
        ) {
          return {
            ...stream,
            isReadyToLink: (stream.isReadyToLink = true),
            target: (stream.target = event.currentTarget as HTMLButtonElement),
          };
        }
        if (
          (stream.isActive && sourcePort?.nodeId === targetPort?.nodeId) ||
          (stream.isActive && sourcePort?.io === targetPort?.io) ||
          (stream.isActive && isPortLinked)
        ) {
          return { ...stream, color: (stream.color = "darkred") };
        }
        return stream;
      }),
    ]);
  }

  function handlePortPointerOut() {
    setStreams(
      streams.map((stream) => {
        if (stream.isActive) {
          return {
            ...stream,
            isReadyToLink: (stream.isReadyToLink = false),
            target: (stream.target = undefined),
            color: (stream.color = "blue"),
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
        <Node
          id={node.id}
          key={node.id}
          title={node.title}
          position={node.position}
          onPointerDown={handleNodePointerDown}
        >
          <div className={styles.portContainer} style={{ top: 0 }}>
            {ports.map((port) => {
              if (port.io === "input" && port.nodeId === node.id) {
                return (
                  <Port
                    {...port}
                    key={port.id}
                    onPointerDown={handlePortPointerDown}
                    onPointerOver={handlePortPointerOver}
                    onPointerOut={handlePortPointerOut}
                  />
                );
              }
            })}
          </div>
          <p className={styles.nodeTitle}>{node.title}</p>
          <div className={styles.portContainer} style={{ bottom: 0 }}>
            {ports.map((port) => {
              if (port.io === "output" && port.nodeId === node.id) {
                return (
                  <Port
                    {...port}
                    key={port.id}
                    onPointerDown={handlePortPointerDown}
                    onPointerOver={handlePortPointerOver}
                    onPointerOut={handlePortPointerOut}
                  />
                );
              }
            })}
          </div>
        </Node>
      ))}

      {streams.map(
        (stream, index) =>
          (stream.isActive || stream.isLinked) &&
          stream.m &&
          stream.l && (
            <Stream
              {...stream}
              key={index.toString()}
              id={index.toString()}
              d={stream.m + stream.l}
            />
          )
      )}
    </main>
  );
}
