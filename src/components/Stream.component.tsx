import { StreamProps } from '@/types/stream.types'

export function Stream({ from, to }: StreamProps) {
  return <path d={`M ${from} L ${to}`} />
}
