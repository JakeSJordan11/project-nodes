import type { StreamData } from "../../types";

export function Stream({ stroke, id, d }: StreamData) {
  return (
    <path
      id={id}
      stroke={stroke}
      strokeWidth={4}
      strokeDasharray={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      d={d}
    />
  );
}
