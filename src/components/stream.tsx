import type { StreamProps } from '@/types/stream'

export function Stream({ from, to }: StreamProps) {
  return <path d={`M ${from} L ${to}`} />
}
