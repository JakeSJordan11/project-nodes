import { NodeData } from "./node.types";

export const initialNodes: NodeData[] = [
  {
    id: "0",
    title: "Input Node",
    io: "input",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 50, y: 50 },
  },
  {
    id: "1",
    title: "Output Node",
    io: "output",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 200, y: 50 },
  },
  {
    id: "2",
    title: "Default Node",
    io: "default",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 350, y: 50 },
  },
];
