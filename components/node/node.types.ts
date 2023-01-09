export interface NodeData {
  id: string;
  title?: string;
  io?: "input" | "output" | "default";
  isActive?: boolean;
  offset?: { x: number; y: number };
  position?: { x: number; y: number };
}
