export enum NodeKind {
  Input = 'input',
  Opertator = 'operator',
  Output = 'output',
}

export enum NodeVariant {
  Addition = 'add',
  Subtraction = 'subtract',
  Multiplication = 'multiply',
  Division = 'divide',
  Exponentiation = 'exponent',
  Modulo = 'modulo',
  Integer = 'integer',
  Float = 'float',
  Boolean = 'boolean',
  String = 'string',
  Result = 'result',
  Color = 'color',
  Blend = 'blend',
  WebGpu = 'webgpu',
}

export enum NodeStatus {
  Idle = 'idle',
  Active = 'active',
}
