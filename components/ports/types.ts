export interface PortProps extends React.HTMLAttributes<HTMLButtonElement> {
  amount: number;
  horizontal?: boolean;
  input?: boolean;
  output?: boolean;
}
