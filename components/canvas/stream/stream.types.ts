import { PortProps } from "../node";

export interface StreamProps {
  id: string;
  streamValue: number;
  isActive: boolean;
  isLinked: boolean;
  m: string;
  l: string;
  sourcePort: PortProps;
  targetPort: PortProps;
}
