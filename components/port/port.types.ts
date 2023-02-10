export interface PortData {
  id: string;
  parentId: string;
  isLinked: boolean;
  title: string;
  type: "input" | "output";
}
