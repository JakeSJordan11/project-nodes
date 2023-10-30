"use client";

import { ContextMenu } from "@/components/context.menu";
import { Node } from "@/components/node";
import { Stream } from "@/components/stream";
import styles from "@/styles/page.module.css";
import { ContextMenuStatus } from "@/types/context.menu";
import { NodeKind, NodeState, NodeStatus, NodeVariant } from "@/types/node";
import { PortKind, PortState, PortStatus } from "@/types/port";
import { StreamProps, StreamStatus } from "@/types/stream";
import { ChangeEvent, PointerEvent, useState } from "react";

export default function Home() {
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [streams, setStreams] = useState<StreamProps[]>([]);
  const [contextMenu, setContextMenu] = useState({
    position: { x: 0, y: 0 },
    status: ContextMenuStatus.Hidden,
  });

  function handleMainPointerMove(event: PointerEvent<HTMLElement>) {
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Active) return node;
      return {
        ...node,
        position: {
          x: event.clientX - node.offset.x,
          y: event.clientY - node.offset.y,
        },
      };
    });
    setNodes(newNodes);
    const newStreams = streams.map((stream) => {
      const { sourceElement, targetElement } = stream;
      const sourceBounds = sourceElement.getBoundingClientRect();
      const targetBounds = targetElement?.getBoundingClientRect();
      const sourceX = sourceBounds.x + sourceBounds.width * 0.5;
      const sourceY = sourceBounds.y + sourceBounds.height * 0.5;
      if (stream.status === StreamStatus.Active) {
        return {
          ...stream,
          l: `${event.clientX} ${event.clientY}`,
        };
      } else if (stream.status === StreamStatus.Linked) {
        if (!targetBounds) return stream;
        const targetX = targetBounds?.x + targetBounds?.width * 0.5;
        const targetY = targetBounds?.y + targetBounds?.height * 0.5;
        return {
          ...stream,
          m: `${sourceX} ${sourceY}`,
          l: `${targetX} ${targetY}`,
        };
      } else return stream;
    });

    setStreams(newStreams);
  }

  function handleMainPointerUp() {
    const newStreams = streams.filter(
      (stream) => stream.status === StreamStatus.Linked
    );
    setStreams(newStreams);
    const newNodes = nodes.map((node) => {
      if (node.status !== NodeStatus.Active) return node;
      return { ...node, status: NodeStatus.Idle };
    });
    setNodes(newNodes);
  }

  function handleContextMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault();
    if (contextMenu.status === ContextMenuStatus.Visible) {
      setContextMenu({
        position: { x: 0, y: 0 },
        status: ContextMenuStatus.Hidden,
      });
    } else if (contextMenu.status === ContextMenuStatus.Hidden) {
      setContextMenu({
        position: { x: event.clientX - 75, y: event.clientY - 10 },
        status: ContextMenuStatus.Visible,
      });
    } else return null;
  }

  function calculateNodeKind(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return NodeKind.Input;
    if (textContent === NodeVariant.Addition) return NodeKind.Operator;
    return NodeKind.Output;
  }

  function calculateNodeVariant(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return NodeVariant.Integer;
    return NodeVariant.Addition;
  }

  function calculateNodeTitle(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return NodeVariant.Integer;
    return NodeVariant.Addition;
  }

  function calculateNodeValue(textContent: string | null) {
    if (textContent === NodeVariant.Integer) return 0;
  }

  function calculateNodePosition(clientX: number, clientY: number) {
    return { x: clientX - 75, y: clientY - 10 };
  }

  function calculateNodeStatus(textContent: string | null) {
    return NodeStatus.Idle;
  }

  function calculatePorts(textContent: string | null) {
    if (textContent === NodeVariant.Integer) {
      return [
        {
          id: crypto.randomUUID(),
          kind: PortKind.Output,
          status: PortStatus.Idle,
          value: 0,
        },
      ];
    }
    if (textContent === NodeVariant.Addition) {
      return [
        {
          id: crypto.randomUUID(),
          kind: PortKind.Input,
          status: PortStatus.Idle,
          value: undefined,
        },
        {
          id: crypto.randomUUID(),
          kind: PortKind.Input,
          status: PortStatus.Idle,
          value: undefined,
        },
        {
          id: crypto.randomUUID(),
          kind: PortKind.Output,
          status: PortStatus.Idle,
          value: undefined,
        },
      ];
    }
    return [];
  }

  function handleItemPointerDown(event: PointerEvent<HTMLButtonElement>) {
    const { textContent } = event.currentTarget;
    const { clientX, clientY } = event;
    const newNodes = [
      ...nodes,
      {
        id: crypto.randomUUID(),
        kind: calculateNodeKind(textContent),
        variant: calculateNodeVariant(textContent),
        title: calculateNodeTitle(textContent),
        value: calculateNodeValue(textContent),
        position: calculateNodePosition(clientX, clientY),
        status: calculateNodeStatus(textContent),
        ports: calculatePorts(textContent),
        offset: calculateNodePosition(clientX, clientY),
      },
    ];
    setNodes(newNodes);
    setContextMenu({
      ...contextMenu,
      status: ContextMenuStatus.Hidden,
    });
  }

  function handleNodePointerDown(event: PointerEvent<HTMLElement>, id: string) {
    const newNodes = nodes.map((node) => {
      if (node.id !== id) return node;
      const bounds = event.currentTarget.getBoundingClientRect();
      return {
        ...node,
        status: NodeStatus.Active,
        offset: {
          x: event.clientX - bounds.x,
          y: event.clientY - bounds.y,
        },
      };
    });
    setNodes(newNodes);
  }

  function handlePortPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    portId: PortState["id"],
    portValue: PortState["value"],
    nodeId: NodeState["id"],
    nodeValue: NodeState["value"]
  ) {
    const target = event.target as HTMLButtonElement;
    const { x, y, width, height } = target.getBoundingClientRect();
    const newStreams = [
      ...streams,
      {
        id: crypto.randomUUID(),
        value: portValue,
        m: `${x + width * 0.5} ${y + height * 0.5}`,
        l: `${x + width * 0.5} ${y + height * 0.5}`,
        status: StreamStatus.Active,
        sourceNodeId: nodeId,
        sourceElement: target,
        sourcePortId: portId,
      },
    ];
    setStreams(newStreams);
    const newNodes = nodes.map((node) => {
      if (node.id !== nodeId) return node;
      return {
        ...node,
        ports: node.ports.map((port) => {
          if (port.id === portId) {
            return {
              ...port,
              status: PortStatus.Active,
            };
          } else return port;
        }),
      };
    });
    setNodes(newNodes);
  }

  function handlePortPointerUp(
    event: PointerEvent<HTMLButtonElement>,
    portId: PortState["id"],
    portValue: PortState["value"],
    nodeId: NodeState["id"],
    nodeValue: NodeState["value"]
  ) {
    const target = event.target as HTMLButtonElement;
    const { x, y, width, height } = target.getBoundingClientRect();
    const newStreams = streams.map((stream) => {
      if (stream.status !== StreamStatus.Active) return stream;
      return {
        ...stream,
        l: `${x + width * 0.5} ${y + height * 0.5}`,
        status: StreamStatus.Linked,
        targetNodeId: nodeId,
        targetElement: target,
        targetPortId: portId,
      };
    });
    setStreams(newStreams);
    const newNodes = nodes.map((node) => {
      return {
        ...node,
        ports: node.ports.map((port) => {
          return {
            ...port,
            status:
              port.id === portId || port.status === PortStatus.Active
                ? PortStatus.Linked
                : port.status,
            value:
              port.id === portId
                ? streams.find(
                    (stream) => stream.status === StreamStatus.Active
                  )?.value
                : port.value,
          };
        }),
      };
    });
    setNodes(() => newNodes);
  }

  function handleValueChange(event: ChangeEvent<HTMLInputElement>, id: string) {
    const newNodes = nodes.map((node) => {
      const { value } = event.target;
      if (node.id === id) {
        return {
          ...node,
          value: Number(value),
          ports: node.ports.map((port) => {
            return {
              ...port,
              value: Number(value),
            };
          }),
        };
      } else return node;
    });
    setNodes(newNodes);
    const newStreams = streams.map((stream) => {
      if (stream.sourceNodeId !== id) return stream;
      return {
        ...stream,
        value: Number(event.target.value),
      };
    });
    setStreams(newStreams);
  }

  return (
    <main
      className={styles.main}
      onPointerMove={handleMainPointerMove}
      onPointerUp={handleMainPointerUp}
      onContextMenu={handleContextMenu}
      onPointerLeave={handleMainPointerUp}
    >
      {contextMenu.status === ContextMenuStatus.Visible ? (
        <ContextMenu
          {...contextMenu}
          position={contextMenu.position}
          onItemPointerDown={handleItemPointerDown}
        />
      ) : null}
      {nodes.map((node) => (
        <Node
          {...node}
          key={node.id}
          onNodePointerDown={handleNodePointerDown}
          onPortPointerDown={handlePortPointerDown}
          onPortPointerUp={handlePortPointerUp}
          onValueChange={handleValueChange}
        />
      ))}
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        {streams.map((stream) => (
          <Stream {...stream} key={stream.id} />
        ))}
      </svg>
    </main>
  );
}
