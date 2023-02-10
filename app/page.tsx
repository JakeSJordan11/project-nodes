"use client";

import { Canvas } from "../components";
import { NodesProvider, PortsProvider, StreamsProvider } from "../context";

export default function Page() {
  return (
    <NodesProvider>
      <PortsProvider>
        <StreamsProvider>
          <Canvas />
        </StreamsProvider>
      </PortsProvider>
    </NodesProvider>
  );
}
