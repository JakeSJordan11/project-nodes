import { MouseEvent, PointerEvent, useState } from "react";
import { ActionType, useCanvasDispatch } from "../../../hooks";
import { Content } from "./content/content.component";
import { NodeMenu } from "./menus";
import styles from "./node.module.css";
import type { NodeProps } from "./node.types";
import { Port } from "./ports";

export function Node({
  title,
  inputs,
  outputs,
  position,
  value,
  type,
}: NodeProps) {
  const dispatch = useCanvasDispatch();

  const [nodeMenuOpen, setNodeMenuOpen] = useState(false);
  const [nodeMenuPosition, setNodeMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    dispatch({ type: ActionType.NODE_POINTER_DOWN, payload: { ...event } });
  }

  function handleNodeMenu(event: PointerEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setNodeMenuPosition({ x: event.clientX, y: event.clientY });
    setNodeMenuOpen(true);
  }

  function handleRemoveNodeClick(event: MouseEvent<HTMLButtonElement>) {
    dispatch({
      type: ActionType.REMOVE_NODE,
      payload: { ...event },
    });
    setNodeMenuOpen(false);
  }

  return (
    <article
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      title={title}
      className={styles.node}
      onPointerDown={handlePointerDown}
      onContextMenu={handleNodeMenu}
    >
      <div className={styles.inputContainer}>
        {inputs.map((port) => (
          <Port key={port.id} {...port} />
        ))}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <Content value={value} type={type} />
      <div className={styles.outputContainer}>
        {outputs.map((port) => (
          <Port key={port.id} {...port} />
        ))}
      </div>
      {nodeMenuOpen && (
        <NodeMenu
          nodeMenuPosition={nodeMenuPosition}
          onRemoveNodeClick={handleRemoveNodeClick}
        />
      )}
    </article>
  );
}
