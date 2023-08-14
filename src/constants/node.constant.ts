export enum NodeStatus {
  Inactive = 'inactive',
  Transmitting = 'transmitting',
  Searching = 'searching',
  Recieving = 'recieving',
}

export enum NodeVariants {
  Input = 'input',
  Output = 'output',
  Operator = 'operator',
}

export enum OperationVariants {
  Addition = 'addition',
  Subtraction = 'subtraction',
  Multiplication = 'multiplication',
  Division = 'division',
  Modulo = 'modulo',
  Exponentiation = 'exponentiation',
}
