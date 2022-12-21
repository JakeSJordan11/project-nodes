import { NodeData } from "./types";

export let initialNodeData: NodeData[] = [
  {
    id: "1",
    type: "input",
    title: "Input",
    position: { x: 250, y: 5 },
    ports: [
      {
        id: "1-1",
        type: "output",
        connectedTo: "",
      },
    ],
  },
  {
    id: "2",
    type: "output",
    title: "Output",
    position: { x: 100, y: 100 },
    ports: [
      {
        id: "2-1",
        type: "input",
        connectedTo: "",
      },
    ],
  },
  {
    id: "3",
    type: "default",
    title: "Default",
    position: { x: 400, y: 100 },
    ports: [
      {
        id: "3-1",
        type: "input",
        connectedTo: "",
      },
      {
        id: "3-2",
        type: "output",
        connectedTo: "",
      },
    ],
  },
];
