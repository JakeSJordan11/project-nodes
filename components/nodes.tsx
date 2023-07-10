import { NumberNode, OperatorNode } from "../components";
import { useCanvas } from "../hooks";

export function Nodes() {
  const { nodes } = useCanvas();
  return (
    <>
      {nodes.map((node) => {
        switch (node.type) {
          case "number":
            return <Node.Number key={node.id} {...node} />;
          case "operator":
            return <Node.Operator key={node.id} {...node} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export const Node = {
  Number: NumberNode,
  Operator: OperatorNode,
};
