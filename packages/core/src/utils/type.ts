export type NULL = undefined;
export type NULL_NUMBER = number | undefined;
export type NULL_NUMBER_ARR = number[] | undefined;
export type NULL_STRING = string | undefined;
export type NULL_STRING_ARR = string[] | undefined;
export type NULL_BOOLEAN = boolean | undefined;
export type NULL_BOOLEAN_ARR = boolean[] | undefined;

export const Type = Function;

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

export interface Type<T> extends Function { new (...args: any[]): T; }

export type Mutable<T extends{[x: string]: any}, K extends number> = {
  [P in K]: T[P];
};
