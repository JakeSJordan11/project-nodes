import type { StreamProps } from "./stream.types";

export function Stream({ stroke, id, d }: StreamProps) {
  return (
    <path
      id={id}
      fill="none"
      strokeDasharray={6}
      strokeWidth={4}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      d={d}
    />
  );
}
