export declare class ModelBase {
    [propName: string]: any;
    __clone__: any;
    constructor(dto?: any);
    update(dto: any): void;
    equal(): boolean;
    revertChangedData(): void;
    getProps(): any;
    setUndefined(column: string): void;
    setNull(column: string): void;
    getClassName(): string;
    getColumns(): any;
    isChanged(): boolean;
    getChangedData(param?: {
        deleteFormatter?: () => {};
    }): any;
    saveChangedData(): void;
    getOriginalData(): any;
    getDbParam(): {
        [index: string]: any;
    };
    getFilterValue(): {
        [index: string]: any;
    };
    /**
     * 如果 removeUndefinedAndNullValue 设置为 true，则 undefined 和 null 的值是获取不到的，
     * 如果你设置了某个属性值为，''，这个属性是可以的值是可以获取到为 '' 的，如果你不想要这个属性的值，
     * 请设置这个属性为 undefined，或者删除掉这个属性的 key
     * @param isFilter 内部属性，通过 getFilterValue 方法调用时有效。
     * @param removeUndefinedAndNullValue
     * @return {{}}
     */
    getSaveData(removeUndefinedAndNullValue: boolean, isFilter: any): {
        [index: string]: any;
    };
    extend(model: any): void;
    getPrimaryKey(): {
        primaryKey: string;
        primaryColumn: any;
    }[];
    getPrimaryValue(): string;
    getPrimaryValueFromData(model: any): string;
}
