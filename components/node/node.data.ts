import type { NodeData } from "./node.types";

export const initialNodes: NodeData[] = [
  {
    id: "0",
    title: "Input Node",
    type: "input",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 50, y: 50 },
    draggable: false,
  },
  {
    id: "1",
    title: "Output Node",
    type: "output",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 200, y: 50 },
    draggable: false,
  },
  {
    id: "2",
    title: "Default Node",
    type: "default",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 350, y: 50 },
    draggable: false,
  },
  {
    id: "3",
    title: "Default Node",
    type: "default",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 500, y: 50 },
    draggable: false,
  },
  {
    id: "4",
    title: "Input Node",
    type: "input",
    isActive: false,
    offset: { x: 0, y: 0 },
    position: { x: 650, y: 50 },
    draggable: false,
  },
];
