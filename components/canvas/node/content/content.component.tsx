import { Number } from "./number.component";
import { Operator } from "./operator.component";

export function Content({
  type,
  value,
}: {
  type: "number" | "operator";
  value: number;
}) {
  switch (type) {
    case "number":
      return <Number value={value} />;
    case "operator":
      return <Operator value={value} />;
    default:
      return null;
  }
}
