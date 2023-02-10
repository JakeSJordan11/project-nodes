import {
  PortsActionType,
  StreamsActionType,
  usePortsDispatch,
  useStreams,
  useStreamsDispatch,
} from "../../context";
import type { StreamData } from "./stream.types";

export function Stream({ stroke, id, d }: StreamData) {
  const streamsDispatch = useStreamsDispatch();
  const portsDispatch = usePortsDispatch();
  const streams = useStreams();
  return (
    <path
      id={id}
      fill="none"
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      d={d}
      onPointerUp={() => {
        streamsDispatch({ type: StreamsActionType.StreamPointerUp });
        portsDispatch({
          type: PortsActionType.StreamPointerUp,
          payload: { streams: streams },
        });
      }}
    />
  );
}
