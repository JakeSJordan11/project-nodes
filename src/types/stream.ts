import { streamStatus } from "@/constants/stream";
import { RefObject } from "react";

export interface StreamProps {
  id: string;
  to: string;
  from: string;
  fromValue: number;
  fromId: string;
  toId: string;
  fromNodeId: string;
  toNodeId: string;
  toRef: RefObject<HTMLButtonElement>;
  fromRef: RefObject<HTMLButtonElement>;
  status: streamStatus;
}
