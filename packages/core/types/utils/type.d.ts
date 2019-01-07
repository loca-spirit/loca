export declare type NULL = undefined;
export declare type NULL_NUMBER = number | undefined;
export declare type NULL_NUMBER_ARR = number[] | undefined;
export declare type NULL_STRING = string | undefined;
export declare type NULL_STRING_ARR = string[] | undefined;
export declare type NULL_BOOLEAN = boolean | undefined;
export declare type NULL_BOOLEAN_ARR = boolean[] | undefined;
export declare const Type: FunctionConstructor;
export declare function isType(v: any): v is Type<any>;
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export declare type Mutable<T extends {
    [x: string]: any;
}, K extends number> = {
    [P in K]: T[P];
};
