export interface NodeData {
  id: string;
  type: "input" | "output" | "default";
  title: string;
  position: { x: number; y: number };
  ports: PortData[];
}
export type PortData = {
  id: string;
  type: "input" | "output";
  connectedTo?: PortData["id"];
};
