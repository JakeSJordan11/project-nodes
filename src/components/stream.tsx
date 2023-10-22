import type { StreamProps } from '@/types/stream'

export function Stream({ m, l }: StreamProps) {
  return <path d={`M ${m} L ${l}`} />
}
