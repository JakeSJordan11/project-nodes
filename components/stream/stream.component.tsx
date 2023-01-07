import type { StreamData, StreamProps } from "./stream.types";

export function Stream({ streamId, stroke, d }: StreamData & StreamProps) {
  return (
    <path
      id={streamId?.toString()}
      fill="none"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      d={d}
    />
  );
}
