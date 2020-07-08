import {
  IConstantInfo,
  IVariableInfo,
  IVarReference,
  IFunctionInfo,
  IDataSVGLine,
  IEnd
} from './Interfaces';



export class Variable implements IVariableInfo {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  type: string = 'Assign Function';
  valueType: string = '';
  name: string = '';
  args: any[] = [null];
  func(incomingVal: any) {
    return incomingVal;
  };
  value: any =  undefined;
  deleted: boolean = false;

  constructor(valueType: string) {
    this.valueType = valueType;
  }
}

export class VarReference implements IVarReference {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  type: string = 'Reference';
  variableReferenced: IVariableInfo = new Variable('Number');
  value: any = null;
  func(scope: Map<string, any>) {
    return scope.get(this.variableReferenced.name);
  };
  deleted: boolean = false;

  constructor(varData: IVariableInfo) {
    this.variableReferenced = varData;
  }
}

export class Operator implements IFunctionInfo {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  type: string = 'Function';
  opType: string = '';
  args: any[] = [null, null];
  func(a: number, b: number): void {};
  value: number = 0;
  deleted: boolean = false;

  constructor(opType: string,) {
    this.opType = opType;

    let opFunc = null
    if (opType === '+') {
      opFunc = (a: number, b: number): number => a + b;
    } else if (opType === '-') {
      opFunc = (a: number, b: number): number => a - b;
    } else if (opType === '*') {
      opFunc = (a: number, b: number): number => a * b;
    } else if (opType === '/') {
      opFunc = (a: number, b: number): number => a / b;
    } else if (opType === '%') {
      opFunc = (a: number, b: number): number => a % b;
    }  else if (opType === 'Console Log') {
      opFunc = (x: any) => { console.log(x); return x };
    } else { 
      opFunc = (): number => 0
    }

    this.func = opFunc
  }
}

export class DataSVGLine implements IDataSVGLine {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  x1: number = 0;
  x2: number = 0;
  y1: number = 0;
  y2: number = 0;
  el1: number | null = null;
  el2: number | null = null;
  data: any = null;

  constructor(position: string, nodeId: number, event: React.MouseEvent) {
    this.x1 = event.clientX;
    this.y1 = event.clientY;
    this.x2 = event.clientX;
    this.y2 = event.clientY;
    this.el1 = position === "bottom" ? nodeId : null;
    this.el2 = position === "bottom" ? null : nodeId;
  }
}

export class End implements IEnd {
  id: number = -(Math.floor(Math.random() * 1000 + 1));
  type: string = 'End';
  args: any[] = [null];
  func(a: any): any {
    return a
  };
  value: any = 1
}