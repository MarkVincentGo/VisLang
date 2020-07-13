import {
  IConstantInfo,
  IVariableInfo,
  IVarReference,
  IFunctionInfo,
  IDataSVGLine,
  IEnd,
  ILoop,
} from './Interfaces';


export class Constant implements IConstantInfo {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  type: string = 'Constant';
  valueType: string = '';
  value: string = '';
  deleted: boolean = false;

  constructor(valueType: string) {
    this.valueType = valueType;
  }
}

export class Variable implements IVariableInfo {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  type: string = 'Assign Function';
  valueType: string = '';
  name: string = '';
  args: any[] = [null];
  func = function(incomingVal: any) {
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
  func = (scope: Map<string, any>) => {
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
  func = function(a: number, b: number): void {};
  increaseArgs = function() {};
  decreaseArgs = function() {};
  value: number = 0;
  deleted: boolean = false;
  color: string = '#FCBB5B';

  constructor(opType: string, color?: string) {
    this.opType = opType;

    if (color) {
      this.color = color;
    }

    switch (opType) {
      case '+':
        this.func = (a: number, b: number): number => a + b;
        break;
      case '-':
        this.func = (a: number, b: number): number => a - b;
        break;
      case '*':
        this.func = (a: number, b: number): number => a * b;
        break;
      case '/':
        this.func = (a: number, b: number): number => a / b;
        break;
      case 'mod':
        this.func = (a: number, b: number): number => a % b;
        break;
      case 'Print':
        this.func = (x: any) => { console.log(x); return x };
        this.args = [null]
        break;
      case '<':
        this.func = (a: number | string, b: number | string): boolean => a < b;
        break;
      case '>':
        this.func = (a: number | string, b: number | string): boolean => a > b;
        break;  
      case '==':
        this.func = (a: number | string, b: number | string): boolean => a === b;
      break;
      case 'Order':
        this.args = [null, null, null];
        this.func = (...args): any => args[args.length - 1];
        this.increaseArgs = function() {this.args = [...this.args, null]};
        this.decreaseArgs = function() {this.args = this.args.slice(0, this.args.length - 1)}
      break;
      default:
        this.func = (): number => 0;
        break;
    }
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
  func = function(a: any): any {
    return a
  };
  value: any = 1
}

export class Loop implements ILoop {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  type: string = 'Loop';
  args: any[] = [1, null];
  func = function() {};
  enclosedComponents = new Set<number>();
}
