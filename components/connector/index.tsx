import type { ConnectorProps } from "./types";

export default function Connector({ d }: ConnectorProps) {
  return (
    <g>
      <linearGradient x1="50%" y1="92.034%" x2="50%" y2="7.2%" id="a">
        <stop offset="0%" stopColor="var(--color-path-stop-1)" />
        <stop offset="100%" stopColor="var(--color-path-stop-2)" />
      </linearGradient>
      <path stroke="url(#a)" strokeWidth="4" strokeLinecap="round" d={d} />
    </g>
  );
}
