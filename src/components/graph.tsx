import { ContextMenu } from "@/components/context.menu";
import styles from "@/styles/page.module.css";
import { useGraph } from "src/hooks/graphs.context";
import { Node } from "./node";
import { Stream } from "./stream";

export default function Graph() {
  const { state, dispatch } = useGraph();

  return (
    <main
      className={styles.main}
      onPointerDown={(event) =>
        dispatch({ type: "graph_pointer_down", payload: { event: event } })
      }
      onPointerMove={(event) =>
        dispatch({ type: "graph_pointer_move", payload: { event: event } })
      }
      onPointerUp={(event) =>
        dispatch({ type: "graph_pointer_up", payload: { event: event } })
      }
      onPointerLeave={(event) =>
        dispatch({ type: "graph_pointer_leave", payload: { event: event } })
      }
      onContextMenu={(event) =>
        dispatch({ type: "graph_menu_show", payload: { event: event } })
      }
    >
      {state.nodes.map((node) => (
        <Node key={node.id} {...node} />
      ))}
      <svg className={styles.svg}>
        {state.streams.map((stream) => (
          <Stream key={stream.id} {...stream} />
        ))}
      </svg>
      {state.ContextMenu.hidden ? null : <ContextMenu />}
    </main>
  );
}
