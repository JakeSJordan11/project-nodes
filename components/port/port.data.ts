import { PortData } from "./port.types";

export const initialPorts: PortData[] = [
  {
    portId: 3,
    nodeId: 0,
    portType: "output",
    portName: "Output 1",
    isLinked: false,
    isHovered: false,
  },
  {
    portId: 4,
    nodeId: 1,
    portType: "input",
    portName: "Input 1",
    isLinked: false,
    isHovered: false,
  },
  {
    portId: 5,
    nodeId: 2,
    portType: "input",
    portName: "Input 2",
    isLinked: false,
    isHovered: false,
  },
  {
    portId: 6,
    nodeId: 2,
    portType: "output",
    portName: "Output 2",
    isLinked: false,
    isHovered: false,
  },
];
