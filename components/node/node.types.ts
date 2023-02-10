export interface NodeData {
  id: string;
  title: string;
  type: "input" | "output" | "default";
  isActive: boolean;
  offset: { x: number; y: number };
  position: { x: number; y: number };
}
