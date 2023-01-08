"use client";

import type { PointerEvent } from "react";
import { useState } from "react";
import { Node } from "../components/node";
import { Stream } from "../components/stream";
import { Port } from "../components/port";
import { initialNodes } from "../components/node/node.data";
import { initialPorts } from "../components/port/port.data";
import { initialStreams } from "../components/stream/stream.data";
import styles from "./page.module.css";

export default function Page() {
  const [nodes, setNodes] = useState(initialNodes);
  const [ports, setPorts] = useState(initialPorts);
  const [streams, setStreams] = useState(initialStreams);
  const [cursor, setCursor] = useState("default");

  let nextId = 0;
  function handleMainPointerMove(event: PointerEvent) {
    setStreams([
      ...streams.map((stream) => {
        if (stream.isLinked && stream.streamSource && stream.streamTarget) {
          return {
            ...stream,
            m: `M ${stream.streamSource.getBoundingClientRect().x + 8} ${
              stream.streamSource.getBoundingClientRect().y + 8
            }`,
            l: `L ${stream.streamTarget.getBoundingClientRect().x + 8} ${
              stream.streamTarget.getBoundingClientRect().y + 8
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
    setNodes(
      nodes.map((node) => {
        if (node.isActive && node.nodeOffset) {
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
      ...streams.map((stream) => {
        const streamSourceBounds = stream.streamSource?.getBoundingClientRect();
        const streamTargetBounds = stream.streamTarget?.getBoundingClientRect();
        if (stream.isReadyToLink && streamTargetBounds && streamSourceBounds) {
          return {
            ...stream,
            m: `M ${streamSourceBounds.x + 8} ${streamSourceBounds.y + 8}`,
            l: `L ${streamTargetBounds.x + 8} ${streamTargetBounds.y + 8}`,
            isLinked: true,
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
    setStreams([
      ...streams,
      {
        streamId: streams.length > 0 ? nextId + 1 : 0,
        isActive: true,
        m: `M ${buttonBounds.x + 8} ${buttonBounds.y + 8}`,
        streamSource: event.currentTarget as HTMLButtonElement,
      },
    ]);
  }

  function handlePortPointerOver(event: PointerEvent) {
    setPorts(
      ports.map((port) => {
        if (port.portId === parseInt(event.currentTarget.id)) {
          return {
            ...port,
            isHovered: true,
          };
        }
        return port;
      })
    );

    setStreams(
      streams.map((stream) => {
        if (stream.isActive) {
          return {
            ...stream,
            isReadyToLink: (stream.isReadyToLink = true),
            streamTarget: (stream.streamTarget =
              event.currentTarget as HTMLButtonElement),
            streamColor: (stream.streamColor = "green"),
          };
        }
        return stream;
      })
    );
  }

  function handlePortPointerOut() {
    setStreams(
      streams.map((stream) => {
        if (stream.isActive) {
          return {
            ...stream,
            isReadyToLink: (stream.isReadyToLink = false),
            streamTarget: (stream.streamTarget = undefined),
          };
        }
        return stream;
      })
    );
  }

  function handleNodePointerDown(event: PointerEvent) {
    setNodes(
      nodes.map((node) => {
        if (node.nodeId === parseInt(event.currentTarget.id)) {
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

  return (
    <main
      className={styles.main}
      style={{ cursor: cursor }}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
    >
      {nodes.map((node) => (
        <Node
          nodeId={node.nodeId}
          nodePosition={node.nodePosition}
          key={node.nodeId}
          onPointerDown={handleNodePointerDown}
        >
          <div className={styles.portContainer} style={{ top: 0 }}>
            {ports.map((port) => {
              if (port.portType === "input" && port.nodeId === node.nodeId) {
                return (
                  <Port
                    {...port}
                    key={port.portId}
                    onPointerDown={handlePortPointerDown}
                    onPointerOver={handlePortPointerOver}
                    onPointerOut={handlePortPointerOut}
                  />
                );
              }
            })}
          </div>
          <p className={styles.nodeTitle}>{node.nodeTitle}</p>
          <div className={styles.portContainer} style={{ bottom: 0 }}>
            {ports.map((port) => {
              if (port.portType === "output" && port.nodeId === node.nodeId) {
                return (
                  <Port
                    {...port}
                    key={port.portId}
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
          stream.l && <Stream {...stream} key={index} d={stream.m + stream.l} />
      )}
    </main>
  );
}
