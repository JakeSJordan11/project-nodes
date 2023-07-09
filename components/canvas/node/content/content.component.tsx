import { NodeProps } from "../node.types";
import { Number } from "./number.component";
import { Operator } from "./operator.component";

export function Content({ ...node }: NodeProps) {
  switch (node.type) {
    case "number":
      return (
        <>
          <Number {...node} />
        </>
      );
    case "operator":
      return (
        <>
          <Operator {...node} />
        </>
      );

    default:
      return null;
  }
}
