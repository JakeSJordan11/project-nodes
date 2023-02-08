"use client";

import type { MouseEvent, PointerEvent } from "react";
import { useState } from "react";
import {
  initialNodes,
  initialPorts,
  initialStreams,
  Node,
  Port,
  Stream,
} from "../../components";
import styles from "./canvas.module.css";

const STREAM_ALIGNMENT = 8;
export function Canvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [ports, setPorts] = useState(initialPorts);
  const [streams, setStreams] = useState(initialStreams);
  const [cursor, setCursor] = useState("default");

  function handleMainPointerMove(event: PointerEvent) {
    setNodes(
      nodes.map((node) => {
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
      })
    );
    setStreams([
      ...streams.map((stream) => {
        const streamSourceBounds = stream.source?.getBoundingClientRect();
        const streamTargetBounds = stream.target?.getBoundingClientRect();
        if (stream.isLinked) {
          return {
            ...stream,
            d: `M ${
              streamSourceBounds && streamSourceBounds.x + STREAM_ALIGNMENT
            } ${
              streamSourceBounds && streamSourceBounds.y + STREAM_ALIGNMENT
            } L ${
              streamTargetBounds && streamTargetBounds.x + STREAM_ALIGNMENT
            } ${streamTargetBounds && streamTargetBounds.y + STREAM_ALIGNMENT}`,
          };
        }
        return {
          ...stream,
          d: `M ${
            streamSourceBounds && streamSourceBounds.x + STREAM_ALIGNMENT
          } ${
            streamSourceBounds && streamSourceBounds.y + STREAM_ALIGNMENT
          } L ${event.clientX} ${event.clientY}`,
        };
      }),
    ]);
  }

  function handleMainPointerUp() {
    setCursor("default");
    setNodes(
      nodes.map((node) => {
        if (!node) {
          return node;
        }
        return {
          ...node,
          isActive: false,
        };
      })
    );
    setStreams([
      ...streams.map((stream) => {
        const streamSourceBounds = stream.source?.getBoundingClientRect();
        const streamTargetBounds = stream.target?.getBoundingClientRect();
        if (stream.isReadyToLink) {
          return {
            ...stream,
            d: `M ${
              streamSourceBounds && streamSourceBounds.x + STREAM_ALIGNMENT
            } ${
              streamSourceBounds && streamSourceBounds.y + STREAM_ALIGNMENT
            } L ${
              streamTargetBounds && streamTargetBounds.x + STREAM_ALIGNMENT
            } ${streamTargetBounds && streamTargetBounds.y + STREAM_ALIGNMENT}`,
            isLinked: true,
            isActive: false,
            isReadyToLink: false,
            stroke: "teal",
          };
        } else if (!stream.isActive) {
          return { ...stream, isActive: false, isReadyToLink: false };
        }
        return {
          ...stream,
          isActive: false,
          isReadyToLink: false,
        };
      }),
    ]);

    streams.map((stream) => {
      stream.isReadyToLink &&
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
    });

    setStreams((prevStreams) =>
      prevStreams.filter((stream) => stream.isLinked)
    );
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
          id: crypto.randomUUID(),
          isActive: true,
          isLinked: false,
          isReadyToLink: false,
          source: event.currentTarget,
          target: null,
          d: `M ${buttonBounds.x + STREAM_ALIGNMENT} ${
            buttonBounds.y + STREAM_ALIGNMENT
          }`,
          stroke: "blue",
        },
      ]);
  }

  function handlePortPointerEnter(event: PointerEvent) {
    const targetPort = ports.find((port) => port.id === event.currentTarget.id);
    const sourcePort = ports.find(
      (port) =>
        port.id === streams.find((stream) => stream.isActive)?.source?.id
    );
    const portTypesMatch = sourcePort?.type === targetPort?.type;
    const portParentsMatch = sourcePort?.parentId === targetPort?.parentId;
    const portIsLinked = targetPort?.isLinked;
    const streamErrors = portTypesMatch || portParentsMatch || portIsLinked;

    /* NOTE: it’s completely fine to change variables and objects that you’ve just created while rendering
    https://beta.reactjs.org/learn/keeping-components-pure#local-mutation-your-components-little-secret */
    setStreams(
      streams.map((stream) => {
        if (!stream.isActive) {
          return stream;
        } else if (streamErrors) {
          stream.stroke = "darkred";
        } else {
          stream.isReadyToLink = true;
          stream.target = event.currentTarget as HTMLButtonElement;
          stream.stroke = "teal";
        }
        return stream;
      })
    );
  }

  function handlePortPointerLeave() {
    /* NOTE: it’s completely fine to change variables and objects that you’ve just created while rendering
    https://beta.reactjs.org/learn/keeping-components-pure#local-mutation-your-components-little-secret */
    setStreams(
      streams.map((stream) => {
        if (!stream.isActive) {
          return stream;
        } else {
          stream.isReadyToLink = false;
          stream.stroke = "blue";
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
        } else return node;
      })
    );
  }

  function handlePortDoubleClick(event: MouseEvent) {
    setStreams([
      ...streams.map((stream) => {
        if (
          stream.source?.id === event.currentTarget.id ||
          stream.target?.id === event.currentTarget.id
        ) {
          return {
            ...stream,
            isLinked: false,
          };
        } else return stream;
      }),
    ]);

    streams
      .filter(
        (stream) =>
          stream.target?.id === event.currentTarget.id ||
          stream.source?.id === event.currentTarget.id
      )
      .map((stream) => {
        setPorts(
          ports.map((port) => {
            if (
              port.id === stream.source?.id ||
              port.id === stream.target?.id
            ) {
              return { ...port, isLinked: false };
            } else return port;
          })
        );
      });

    setStreams((prevStreams) =>
      prevStreams.filter((stream) => stream.isLinked)
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
                    onDoubleClick={handlePortDoubleClick}
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
                    onDoubleClick={handlePortDoubleClick}
                    {...port}
                  />
                );
              }
            })}
          </div>
        </Node>
      ))}
      <svg
        className={styles.streams}
        height={"100%"}
        width={"100%"}
        preserveAspectRatio="xMinYMin meet"
      >
        {streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
    </main>
  );
}
