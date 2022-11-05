"use client";

import styles from "./page.module.css";
import type { ChangeEvent, PointerEvent } from "react";
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
  const [hoveredPort, setHoveredPort] = useState<HTMLButtonElement | null>();
  const [startPort, setStartPort] = useState<HTMLButtonElement | null>();
  const [mathValue, setMathValue] = useState(0);
  const [currentPathColor, setCurrentPathColor] = useState("");
  const [paths, setPaths] = useState<
    {
      startPort: HTMLButtonElement;
      endPort: HTMLButtonElement;
    }[]
  >([]);

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

  function handleDown(event: PointerEvent) {
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

  function handleMove(event: PointerEvent) {
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
    }
  }

  function handleUp() {
    setIsDragging(false);
    setCurrentPath(undefined);
    if (hoveredPort?.parentElement?.id !== startPort?.parentElement?.id) {
      if (
        hoveredPort?.parentElement?.getAttribute("data-node-type") !==
        startPort?.parentElement?.getAttribute("data-node-type")
      ) {
        hoveredPort &&
          setPaths([
            ...paths,
            {
              startPort: startPort!,
              endPort: hoveredPort,
            },
          ]);
      }
    }
  }

  function handleOver(event: PointerEvent) {
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
      }
    }
  }

  function handleLeave() {
    setHoveredPort(null);
  }

  function handleDoubleClick(event: MouseEvent) {
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
    }
  }

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
  }, [numberNode1Value, numberNode2Value, isDragging]);

  return (
    <main
      className={styles.main}
      onPointerUp={handleUp}
      onPointerMove={handleMove}
    >
      {/* number node1 */}
      <article
        className={styles.nodeContainer}
        style={{ left: "5rem" }}
        data-node-type="number"
      >
        <input
          className={styles.numberNodeInput}
          value={numberNode1Value}
          onChange={handleNumberNode1Change}
          data-np-checked
        />
        <input
          className={styles.numberNodeSlider}
          type="range"
          max={10}
          value={numberNode1Value}
          onChange={handleNumberNode1Change}
          data-np-checked
        />
        <button
          className={styles.outputPort}
          ref={outputPort1}
          id="outputPort1"
          data-port-type="output"
          data-port-connected={
            paths.find(
              (path) =>
                path.startPort === outputPort1.current ||
                path.endPort === outputPort1.current
            )
              ? true
              : false
          }
          onPointerDown={handleDown}
          onPointerLeave={handleLeave}
          onPointerOver={handleOver}
          onDoubleClick={() => handleDoubleClick}
        />
      </article>
      {/* number node2 */}
      <article
        className={styles.nodeContainer}
        style={{ left: "35rem" }}
        data-node-type="number"
        id="number-node2"
      >
        <input
          className={styles.numberNodeInput}
          value={numberNode2Value}
          onChange={handleNumberNode2Change}
          data-np-checked
        />
        <input
          className={styles.numberNodeSlider}
          type="range"
          max={10}
          value={numberNode2Value}
          onChange={handleNumberNode2Change}
          data-np-checked
        />
        <button
          className={styles.outputPort}
          ref={outputPort2}
          id="outputPort2"
          data-port-type="output"
          data-port-connected={
            paths.find(
              (path) =>
                path.startPort === outputPort2.current ||
                path.endPort === outputPort2.current
            )
              ? true
              : false
          }
          onPointerDown={handleDown}
          onPointerLeave={handleLeave}
          onPointerOver={handleOver}
        />
      </article>
      {/* math node */}
      <article
        className={styles.nodeContainer}
        style={{ left: "20rem", top: "20rem" }}
        data-node-type="math"
        id="math-node1"
      >
        <button
          className={styles.inputPort1}
          ref={inputPort1}
          id="inputPort1"
          data-port-type="input"
          data-port-connected={
            paths.find(
              (path) =>
                path.startPort === inputPort1.current ||
                path.endPort === inputPort1.current
            )
              ? true
              : false
          }
          onPointerDown={handleDown}
          onPointerLeave={handleLeave}
          onPointerOver={handleOver}
          onDoubleClick={() => handleDoubleClick}
        />
        <button
          className={styles.inputPort2}
          ref={inputPort2}
          id="inputPort2"
          data-port-type="input"
          data-port-connected={
            paths.find(
              (path) =>
                path.startPort === inputPort2.current ||
                path.endPort === inputPort2.current
            )
              ? true
              : false
          }
          onPointerDown={handleDown}
          onPointerLeave={handleLeave}
          onPointerOver={handleOver}
          onDoubleClick={() => handleDoubleClick}
        />
        <div className={styles.mathNodeLabel}>Add</div>
        <div className={styles.mathNodeValue} data-np-checked>
          {mathValue}
        </div>
      </article>
      {/* connectors */}
      <svg className={styles.connectors}>
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
            d={`M ${path.startPort.getBoundingClientRect().x + 8} ${
              path.startPort.getBoundingClientRect().y + 8
            } L ${path.endPort.getBoundingClientRect().x + 8} ${
              path.endPort.getBoundingClientRect().y + 8
            }`}
          />
        ))}
        {currentPath && (
          <path
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
