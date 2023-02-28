import type { PointerEvent } from "react";
import { CanvasActionType, useCanvasDispatch } from "../../../hooks";
import { Content } from "./content/content.component";
import styles from "./node.module.css";
import type { NodeProps } from "./node.types";
import { Port } from "./port";

export function Node({
  title,
  inputs,
  outputs,
  position,
  value,
  type,
  id,
  ...articleProps
}: NodeProps) {
  const dispatch = useCanvasDispatch();

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    dispatch({ type: CanvasActionType.SELECT_NODE, payload: { ...event } });
  }

  return (
    <article
      className={styles.node}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      id={id}
      onPointerDown={handlePointerDown}
      onPointerUp={() => dispatch({ type: CanvasActionType.DROP_NODE })}
      {...articleProps}
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
    </article>
  );
}
