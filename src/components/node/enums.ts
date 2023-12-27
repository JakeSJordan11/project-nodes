export enum NodeKind {
  Input = 'input',
  Opertator = 'operator',
  Output = 'output',
}

export enum NodeVariant {
  Addition = 'addition',
  Subtraction = 'subtraction',
  Multiplication = 'multiplication',
  Division = 'division',
  Modulo = 'modulo',
  Power = 'power',
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
