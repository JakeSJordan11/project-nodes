import { NodeData } from "./node.types";

export const initialNodes: NodeData[] = [
  {
    nodeId: 0,
    nodeType: "input",
    nodeTitle: "Input",
    isActive: false,
    nodePosition: { x: 50, y: 50 },
    nodeOffset: { x: 0, y: 0 },
    portIds: [0],
  },
  {
    nodeId: 1,
    nodeType: "output",
    nodeTitle: "Output",
    isActive: false,
    nodePosition: { x: 200, y: 50 },
    nodeOffset: { x: 0, y: 0 },
    portIds: [1],
  },
  {
    nodeId: 2,
    nodeType: "default",
    nodeTitle: "Default",
    isActive: false,
    nodePosition: { x: 350, y: 50 },
    nodeOffset: { x: 0, y: 0 },
    portIds: [2, 3],
  },
];
