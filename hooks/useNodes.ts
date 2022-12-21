import type { PointerEvent } from "react";
import { useState } from "react";

export function useNodes() {
  const [nodePosition, setNodePosition] = useState({
    x: 0,
    y: 0,
  });
  const [nodeOffsetPosition, setNodeOffsetPosition] = useState({ x: 0, y: 0 });
  const [nodePointerDown, setNodePointerDown] = useState(false);

  const nodeStyles = {
    top: nodePosition.y,
    left: nodePosition.x,
  };

  function handleNodePointerDown(event: PointerEvent) {
    // this allows draggin nodes freely
    event.currentTarget.setPointerCapture(event.pointerId);

    setNodePointerDown(true);
    setNodeOffsetPosition({
      x: event.clientX - event.currentTarget.getBoundingClientRect().x,
      y: event.clientY - event.currentTarget.getBoundingClientRect().y,
    });
  }

  function handleNodePointerUp() {
    nodePointerDown && setNodePointerDown(false);
  }

  function handleNodePointerMove(event: PointerEvent) {
    nodePointerDown &&
      setNodePosition({
        x: event.clientX - nodeOffsetPosition.x,
        y: event.clientY - nodeOffsetPosition.y,
      });
  }

  return {
    nodeStyles,
    handleNodePointerDown,
    handleNodePointerUp,
    handleNodePointerMove,
    nodePosition,
    setNodePosition,
  };
}
