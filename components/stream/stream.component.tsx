import type { StreamData } from "./stream.types";

export function Stream({ stroke, id, d }: StreamData) {
  return (
    <path
      id={id}
      fill="none"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      d={d}
    />
  );
}
