"use client";

import styles from "./page.module.css";
import type { ChangeEvent, MouseEvent, PointerEvent } from "react";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [numberNode1Value, setNumberNode1Value] = useState("2");
  const [numberNode2Value, setNumberNode2Value] = useState("8");
  const [currentPath, setCurrentPath] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>();
  const outputPort1 = useRef<HTMLButtonElement>(null);
  const outputPort2 = useRef<HTMLButtonElement>(null);
  const inputPort1 = useRef<HTMLButtonElement>(null);
  const inputPort2 = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<HTMLButtonElement>();
  const [startPort, setStartPort] = useState<HTMLButtonElement>();
  const [mathValue, setMathValue] = useState(0);
  const [currentPathColor, setCurrentPathColor] = useState("");
  const [paths, setPaths] = useState<
    {
      startPort: HTMLButtonElement;
      endPort: HTMLButtonElement;
    }[]
  >([]);
  const [mathNode1Position, setMathNode1Position] = useState<{
    x: number;
    y: number;
  }>({ x: 200, y: 300 });
  const [mathNode1Offset, setMathNode1Offset] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [numberNode2Position, setNumberNode2Position] = useState<{
    x: number;
    y: number;
  }>({ x: 50, y: 50 });
  const [numberNode2Offset, setNumberNode2Offset] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [numberNode1Position, setNumberNode1Position] = useState<{
    x: number;
    y: number;
  }>({ x: 350, y: 50 });
  const [numberNode1Offset, setNumberNode1Offset] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  function handleNumberNode1Change(event: ChangeEvent<HTMLInputElement>) {
    setNumberNode1Value(event.target.value);
    if (outputPort1.current?.getAttribute("data-port-connected") === "true") {
      if (inputPort1.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(event.target.value));
      }
      if (inputPort2.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(event.target.value));
      }
      if (
        inputPort1.current?.getAttribute("data-port-connected") === "true" &&
        inputPort2.current?.getAttribute("data-port-connected") === "true"
      ) {
        setMathValue(Number(event.target.value) + Number(numberNode2Value));
      }
    }
  }

  function handleNumberNode2Change(event: ChangeEvent<HTMLInputElement>) {
    setNumberNode2Value(event.target.value);
    if (outputPort2.current?.getAttribute("data-port-connected") === "true") {
      if (inputPort1.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(event.target.value));
      }
      if (inputPort2.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(event.target.value));
      }
      if (
        inputPort1.current?.getAttribute("data-port-connected") === "true" &&
        inputPort2.current?.getAttribute("data-port-connected") === "true"
      ) {
        setMathValue(Number(event.target.value) + Number(numberNode1Value));
      }
    }
  }

  function handleInputDown(event: PointerEvent<HTMLInputElement>) {
    event.stopPropagation();
  }

  function handleNodeDown(event: PointerEvent<HTMLButtonElement>) {
    setIsDraggingNode(true);
    event.currentTarget.style.cursor = "grabbing";
    event.currentTarget.style.userSelect = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
    switch (event.currentTarget.id) {
      case "numberNode1":
        setNumberNode1Offset({
          x: event.clientX - event.currentTarget.getBoundingClientRect().x,
          y: event.clientY - event.currentTarget.getBoundingClientRect().y,
        });
        break;
      case "numberNode2":
        setNumberNode2Offset({
          x: event.clientX - event.currentTarget.getBoundingClientRect().x,
          y: event.clientY - event.currentTarget.getBoundingClientRect().y,
        });
        break;
      case "mathNode1":
        setMathNode1Offset({
          x: event.clientX - event.currentTarget.getBoundingClientRect().x,
          y: event.clientY - event.currentTarget.getBoundingClientRect().y,
        });
        break;
    }
  }

  function handleNodeMove(event: PointerEvent<HTMLButtonElement>) {
    switch (event.currentTarget.id) {
      case "mathNode1":
        isDraggingNode &&
          setMathNode1Position({
            x: event.clientX - mathNode1Offset.x,
            y: event.clientY - mathNode1Offset.y,
          });
        break;
      case "numberNode2":
        isDraggingNode &&
          setNumberNode2Position({
            x: event.clientX - numberNode2Offset.x,
            y: event.clientY - numberNode2Offset.y,
          });
        break;
      case "numberNode1":
        isDraggingNode &&
          setNumberNode1Position({
            x: event.clientX - numberNode1Offset.x,
            y: event.clientY - numberNode1Offset.y,
          });
        break;
    }
  }

  function handleNodeUp(event: PointerEvent<HTMLButtonElement>) {
    setIsDraggingNode(false);
    // NOTE: Don't wory about making this css LOW PRIORITY
    event.currentTarget.style.cursor = "grab";
  }

  function handlePortDown(event: PointerEvent) {
    setIsDragging(true);
    let port;
    setStartPort(port);
    switch (event.currentTarget) {
      case outputPort1.current:
        port = outputPort1.current;
        break;
      case outputPort2.current:
        port = outputPort2.current;
        break;
      case inputPort1.current:
        port = inputPort1.current;
        break;
      case inputPort2.current:
        port = inputPort2.current;
        break;
    }
    if (port) {
      /* setStartPort(port); */
      event.stopPropagation();
      port.style.userSelect = "none";
    }
    if (port?.getAttribute("data-port-connected") === "false") {
      setStartPort(port);
      port.parentElement?.getAttribute("data-node-type") === "number"
        ? setCurrentPathColor("var(--color-background-numberNode")
        : setCurrentPathColor("var(--color-background-mathNode");
      setCurrentPath({
        x1: port.getBoundingClientRect().x + 8,
        y1: port.getBoundingClientRect().y + 8,
        x2: port.getBoundingClientRect().x + 8,
        y2: port.getBoundingClientRect().y + 8,
      });
    }
  }

  function handleMainMove(event: PointerEvent) {
    if (isDragging) {
      setCurrentPath((currentPath) => {
        if (currentPath) {
          return {
            x1: currentPath.x1,
            y1: currentPath.y1,
            x2: event.clientX,
            y2: event.clientY,
          };
        }
      });
      // TODO: should be replaced with a react way of doing this
      window.document.body.style.cursor = "crosshair";

      paths.find(
        (path) =>
          path.startPort === outputPort2.current ||
          path.endPort === outputPort2.current
      )
        ? outputPort2.current?.setAttribute("data-port-connected", "true")
        : outputPort2.current?.setAttribute("data-port-connected", "false");
    }
  }

  function handleMainUp() {
    // TODO: should be replaced with a react way of doing this
    window.document.body.style.cursor = "default";
    setIsDragging(false);
    setCurrentPath(undefined);
    if (hoveredPort?.parentElement?.id !== startPort?.parentElement?.id) {
      if (
        hoveredPort?.parentElement?.getAttribute("data-node-type") !==
        startPort?.parentElement?.getAttribute("data-node-type")
      ) {
        startPort &&
          hoveredPort &&
          setPaths([
            ...paths,
            {
              startPort: startPort,
              endPort: hoveredPort,
            },
          ]);
        hoveredPort && startPort?.setAttribute("data-port-connected", "true");
        hoveredPort?.setAttribute("data-port-connected", "true");
      }
    }
  }

  function handlePortOver(event: PointerEvent) {
    if (isDragging) {
      switch (event.currentTarget) {
        case inputPort1.current:
          inputPort1.current?.getAttribute("data-port-connected") === "false" &&
            setHoveredPort(inputPort1.current);
          break;
        case inputPort2.current:
          inputPort2.current?.getAttribute("data-port-connected") === "false" &&
            setHoveredPort(inputPort2.current);
          break;
        case outputPort1.current:
          outputPort1.current?.getAttribute("data-port-connected") ===
            "false" && setHoveredPort(outputPort1.current);
          break;
        case outputPort2.current:
          outputPort2.current?.getAttribute("data-port-connected") ===
            "false" && setHoveredPort(outputPort2.current);
          break;
        default:
          setHoveredPort(undefined);
      }
    }
  }

  function handlePortLeave() {
    setHoveredPort(undefined);
  }

  function handlePortDoubleClick(event: MouseEvent<HTMLButtonElement>) {
    switch (event.currentTarget) {
      case inputPort1.current:
        inputPort1.current?.getAttribute("data-port-connected") === "true" &&
          setPaths((paths) =>
            paths.filter(
              (path) =>
                path.startPort !== inputPort1.current &&
                path.endPort !== inputPort1.current
            )
          );
        inputPort1.current?.setAttribute("data-port-connected", "false");
        break;
      case inputPort2.current:
        inputPort2.current?.getAttribute("data-port-connected") === "true" &&
          setPaths((paths) =>
            paths.filter(
              (path) =>
                path.startPort !== inputPort2.current &&
                path.endPort !== inputPort2.current
            )
          );
        inputPort2.current?.setAttribute("data-port-connected", "false");
        break;
      case outputPort1.current:
        outputPort1.current?.getAttribute("data-port-connected") === "true" &&
          setPaths((paths) =>
            paths.filter(
              (path) =>
                path.startPort !== outputPort1.current &&
                path.endPort !== outputPort1.current
            )
          );
        outputPort1.current?.setAttribute("data-port-connected", "false");
        break;
      case outputPort2.current:
        outputPort2.current?.getAttribute("data-port-connected") === "true" &&
          setPaths((paths) =>
            paths.filter(
              (path) =>
                path.startPort !== outputPort2.current &&
                path.endPort !== outputPort2.current
            )
          );
        outputPort2.current?.setAttribute("data-port-connected", "false");
        break;
      default:
        break;
    }
  }

  //TODO: there should be a way to do this without the useEfect hook this feels like it's not using react correctly
  useEffect(() => {
    if (outputPort1.current?.getAttribute("data-port-connected") === "true") {
      if (inputPort1.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(numberNode1Value));
      }
      if (inputPort2.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(numberNode1Value));
      }
      if (
        inputPort1.current?.getAttribute("data-port-connected") === "true" &&
        inputPort2.current?.getAttribute("data-port-connected") === "true"
      ) {
        setMathValue(Number(numberNode1Value) + Number(numberNode2Value));
      }
    }
    if (outputPort2.current?.getAttribute("data-port-connected") === "true") {
      if (inputPort1.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(numberNode2Value));
      }
      if (inputPort2.current?.getAttribute("data-port-connected") === "true") {
        setMathValue(Number(numberNode2Value));
      }
      if (
        inputPort1.current?.getAttribute("data-port-connected") === "true" &&
        inputPort2.current?.getAttribute("data-port-connected") === "true"
      ) {
        setMathValue(Number(numberNode1Value) + Number(numberNode2Value));
      }
    }
    // INFO: sets the data-port-connected attribute
    // TODO: this could be done in a better way
    paths.find(
      (path) =>
        path.startPort === outputPort2.current ||
        path.endPort === outputPort2.current
    )
      ? outputPort2.current?.setAttribute("data-port-connected", "true")
      : outputPort2.current?.setAttribute("data-port-connected", "false");
    paths.find(
      (path) =>
        path.startPort === outputPort1.current ||
        path.endPort === outputPort1.current
    )
      ? outputPort1.current?.setAttribute("data-port-connected", "true")
      : outputPort1.current?.setAttribute("data-port-connected", "false");
    paths.find(
      (path) =>
        path.startPort === inputPort1.current ||
        path.endPort === inputPort1.current
    )
      ? inputPort1.current?.setAttribute("data-port-connected", "true")
      : inputPort1.current?.setAttribute("data-port-connected", "false");
    paths.find(
      (path) =>
        path.startPort === inputPort2.current ||
        path.endPort === inputPort2.current
    )
      ? inputPort2.current?.setAttribute("data-port-connected", "true")
      : inputPort2.current?.setAttribute("data-port-connected", "false");
  }, [paths, numberNode1Value, numberNode2Value]);

  return (
    <main
      className={styles.main}
      onPointerUp={handleMainUp}
      onPointerMove={handleMainMove}
    >
      {/* number node1 */}
      <article
        className={styles.nodeContainer}
        style={{ left: numberNode1Position.x, top: numberNode1Position.y }}
        data-node-type="number"
        id="numberNode1"
        onPointerDown={handleNodeDown}
        onPointerMove={handleNodeMove}
        onPointerUp={handleNodeUp}
      >
        <input
          className={styles.numberNodeInput}
          value={numberNode1Value}
          onChange={handleNumberNode1Change}
          onPointerDown={handleInputDown}
          data-np-checked
        />
        <input
          className={styles.numberNodeSlider}
          type="range"
          max={10}
          value={numberNode1Value}
          onChange={handleNumberNode1Change}
          onPointerDown={handleInputDown}
          data-np-checked
        />
        <button
          className={styles.outputPort}
          ref={outputPort1}
          id="outputPort1"
          data-port-type="output"
          onPointerDown={handlePortDown}
          onPointerLeave={handlePortLeave}
          onPointerOver={handlePortOver}
          onDoubleClick={handlePortDoubleClick}
        />
      </article>
      {/* number node2 */}
      <article
        className={styles.nodeContainer}
        style={{ left: numberNode2Position.x, top: numberNode2Position.y }}
        data-node-type="number"
        id="numberNode2"
        onPointerDown={handleNodeDown}
        onPointerMove={handleNodeMove}
        onPointerUp={handleNodeUp}
      >
        <input
          className={styles.numberNodeInput}
          value={numberNode2Value}
          onChange={handleNumberNode2Change}
          onPointerDown={handleInputDown}
          data-np-checked
        />
        <input
          className={styles.numberNodeSlider}
          type="range"
          max={10}
          value={numberNode2Value}
          onChange={handleNumberNode2Change}
          onPointerDown={handleInputDown}
          data-np-checked
        />
        <button
          className={styles.outputPort}
          ref={outputPort2}
          id="outputPort2"
          data-port-type="output"
          onPointerDown={handlePortDown}
          onPointerLeave={handlePortLeave}
          onPointerOver={handlePortOver}
          onDoubleClick={handlePortDoubleClick}
        />
      </article>
      {/* math node */}
      <article
        className={styles.nodeContainer}
        style={{ left: mathNode1Position.x, top: mathNode1Position.y }}
        data-node-type="math"
        id="mathNode1"
        onPointerDown={handleNodeDown}
        onPointerMove={handleNodeMove}
        onPointerUp={handleNodeUp}
      >
        <button
          className={styles.inputPort1}
          ref={inputPort1}
          id="inputPort1"
          data-port-type="input"
          onPointerDown={handlePortDown}
          onPointerLeave={handlePortLeave}
          onPointerOver={handlePortOver}
          onDoubleClick={handlePortDoubleClick}
        />
        <button
          className={styles.inputPort2}
          ref={inputPort2}
          id="inputPort2"
          data-port-type="input"
          onPointerDown={handlePortDown}
          onPointerLeave={handlePortLeave}
          onPointerOver={handlePortOver}
          onDoubleClick={handlePortDoubleClick}
        />
        <div className={styles.mathNodeLabel}>Add</div>
        <div
          className={styles.mathNodeValue}
          onPointerDown={handleInputDown}
          data-np-checked
        >
          {mathValue}
        </div>
      </article>
      {/* connectors */}
      <svg className={styles.connectors} preserveAspectRatio="xMinYMin meet">
        <linearGradient x1="50%" y1="92.034%" x2="50%" y2="7.2%" id="a">
          <stop offset="0%" stopColor="var(--color-background-mathNode)" />
          <stop offset="100%" stopColor="var(--color-background-numberNode)" />
        </linearGradient>
        {paths.map((path, index) => (
          <path
            key={index}
            stroke="url(#a)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
            d={`M ${path.startPort.getBoundingClientRect().x + 8} ${
              path.startPort.getBoundingClientRect().y + 8
            } L ${path.endPort.getBoundingClientRect().x + 8} ${
              path.endPort.getBoundingClientRect().y + 8
            }`}
          />
        ))}
        {currentPath && (
          <path
            cursor="crosshair"
            stroke={currentPathColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            d={`M${currentPath.x1} ${currentPath.y1} L${currentPath.x2} ${currentPath.y2}`}
          />
        )}
      </svg>
    </main>
  );
}
