export interface IConstantInfo {
  [key: string]: any,
  readonly id: number,
  type: string,
  value: string,
  deleted: boolean,
  color?: string
}

export interface IVariableInfo {
  [key: string]: any,
  readonly id: number,
  type: string,
  valueType: string,
  name: string,
  args: any[],
  func(...args: any[]): void,
  value?: any,
  deleted: boolean,
}

export interface IVarReference {
  readonly id: number,
  readonly variableReferenced: IVariableInfo,
  args?: any[]
  func(scope: Map<string, any>): void,
  value: any,
  type: string,
  deleted: boolean,
}

export interface IFunctionInfo {
  [key: string]: any,
  readonly id: number,
  type: string,
  opType: string,
  args: any[],
  func(...args: any[]): void,
  increaseArgs?(): void,
  decreaseArgs?(): void,
  value: number | string | boolean,
  deleted: boolean
}

export interface IDataSVGLine {
  readonly id: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  data: any,
  el1: number | null,
  el2: number | null,
}

export interface IEnd {
  readonly id: number,
  type: string;
  args: any[];
  func(a: any): any,
  value: any,
}

export interface ILoop {
  [key: string]: any,
  readonly id: number,
  type: string,
  args: any[],
  func(): any,
  enclosedComponents: Set<number>
}

