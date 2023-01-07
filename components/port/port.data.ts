import { PortData } from "./port.types";

export const initialPorts: PortData[] = [
  {
    portId: 0,
    nodeId: 0,
    portType: "output",
    portName: "Output 1",
  },
  {
    portId: 1,
    nodeId: 1,
    portType: "input",
    portName: "Input 1",
  },
  {
    portId: 2,
    nodeId: 2,
    portType: "input",
    portName: "Input 2",
  },
  {
    portId: 3,
    nodeId: 2,
    portType: "output",
    portName: "Output 2",
  },
];
