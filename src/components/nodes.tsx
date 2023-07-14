import { NumberNode } from "@/components/node.number";
import { OperatorNode } from "@/components/node.operator";
import { useCanvas } from "@/hooks/canvas.context";

export function Nodes() {
  const { nodes } = useCanvas();
  return (
    <>
      {nodes.map((node) => {
        switch (node.type) {
          case "number":
            return <NumberNode key={node.id} {...node} />;
          case "operator":
            return <OperatorNode key={node.id} {...node} />;
          default:
            return null;
        }
      })}
    </>
  );
}
