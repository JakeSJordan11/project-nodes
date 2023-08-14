import { StreamStatus } from '@/constants'
import { NodeProps, StreamProps } from '@/types'

export function useStream(streams: StreamProps[], nodes: NodeProps[]) {
  const activeStream = streams.find((stream) => stream.status === StreamStatus.Active)
  const linkedStreams = streams.find((stream) => stream.status === StreamStatus.Linked)
  const transmitter = activeStream
    ? nodes.find((node) => node.id === activeStream.transmitterId)
    : linkedStreams
    ? nodes.find((node) => node.id === linkedStreams.transmitterId)
    : null
  const reciever = activeStream
    ? nodes.find((node) => node.id === activeStream.recieverId)
    : linkedStreams
    ? nodes.find((node) => node.id === linkedStreams?.recieverId)
    : null
  return { transmitter, reciever, activeStream, linkedStreams }
}
