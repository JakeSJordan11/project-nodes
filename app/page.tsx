"use client";

import { Canvas } from "../components";
import { CanvasProvider } from "../hooks";

export default function Page() {
  return (
    <CanvasProvider>
      <Canvas />
    </CanvasProvider>
  );
}
