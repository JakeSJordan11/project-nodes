import { NodeProps } from "../node.types";
import { Inputs, Outputs } from "../port";
import { Number } from "./number.component";
import { Operator } from "./operator.component";

export function Content({ ...node }: NodeProps) {
  switch (node.type) {
    case "number":
      return (
        <>
          <Number {...node} />
          <Outputs {...node} />
        </>
      );
    case "operator":
      return (
        <>
          <Inputs {...node} />
          <Operator {...node} />
        </>
      );

    default:
      return null;
  }
}
