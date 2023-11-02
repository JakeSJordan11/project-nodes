"use client";

import Graph from "@/components/graph";
import { GraphProvider } from "src/hooks/graphs.context";

export default function Home() {
  return (
    <GraphProvider>
      <Graph />
    </GraphProvider>
  );
}
