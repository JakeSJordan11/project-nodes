export interface StreamProps {
  id: string;
  isActive: boolean;
  isLinked: boolean;
  target: HTMLButtonElement | null;
  source: HTMLButtonElement | null;
  d: string;
  stroke: string;
}
