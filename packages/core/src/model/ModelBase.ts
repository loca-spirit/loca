import * as modelUtil from '../utils/modelUtil';
import merge from 'deepmerge';
import {getClassName, isPlainObject} from '../utils';

function setColumnToTarget(columns: any, target: any) {
  const curProto = Object.getPrototypeOf(target);
  const className = curProto.getClassName();
  if (curProto.constructor[className]) {
    Object.assign(columns, curProto.constructor[className].columns || {});
  }
}

function getColumns(columns: any, target: any): any {
  const curProto = Object.getPrototypeOf(target);
  if (Object.getPrototypeOf(curProto).getClassName() !== ModelBase.prototype.getClassName()) {
    Object.assign(columns, getColumns(columns, curProto));
    setColumnToTarget(columns, target);
    return;
  }
  setColumnToTarget(columns, target);
  return;
}

export class ModelBase {
  [propName: string]: any;

  public __clone__: any;

  constructor(dto?: any) {
    const className = this.constructor.prototype.getClassName() || '';
    // @ts-ignore
    this.constructor[className] = this.constructor[className] || {};
    modelUtil.createModelByDTO(this, this.getColumns(), dto);
  }

  public update(dto: any) {
    modelUtil.updateModelByDTO(this, this.getColumns(), dto);
  }

  public equal() {
    return true;
  }

  public revertChangedData() {
    const C = Object.getPrototypeOf(this).constructor as any;
    const org = new C(this.getOriginalData());
    const columns = this.getColumns();
    for (const key in columns) {
      this[key] = org[key];
    }
  }

  public getProps() {
    return this.getColumns();
  }

  public setUndefined(column: string) {
    // TODO: check key.
    this[column] = undefined;
  }

  public setNull(column: string) {
    // TODO: check key.
    this[column] = null;
  }

  public getClassName() {
    return '__' + getClassName(this.constructor) + '__';
  }

  public getColumns() {
    // @ts-ignore
    if (!this.constructor[this.getClassName()]) {
      return {};
    }
    const columns = {};
    // this.constructor[this.getClassName()].columns
    // @ts-ignore
    return Object.assign(columns, getColumns(columns, this));
  }

  public isChanged() {
    return Object.keys(this.getChangedData()).length !== 0;
  }

  public getChangedData(param?: {
    deleteFormatter?: () => {},
  }) {
    const columns = this.getColumns();
    const target = this as any;
    const changedObj = {} as any;
    const targetData = this.getDbParam();
    Object.keys(columns).forEach((columnName) => {
      const orgColumn = columns[columnName].column;
      const oldValue = target.getOriginalData()[orgColumn];
      const curValue = targetData[orgColumn];
      // 处理删除的数据
      if (typeof oldValue !== 'undefined' && typeof curValue === 'undefined') {
        changedObj[orgColumn] = param && param.deleteFormatter ? param.deleteFormatter.apply(null) : undefined;
      } else if (typeof oldValue === 'undefined' && typeof curValue !== 'undefined') {
        // 处理新增的数据
        changedObj[orgColumn] = curValue;
      } else {
        // 处理变更的数据
        if (isPlainObject(oldValue) || Array.isArray(oldValue)) {
          const oldValueStr = JSON.stringify(oldValue);
          const curValueStr = JSON.stringify(curValue);
          if (oldValueStr !== curValueStr) {
            changedObj[orgColumn] = curValue;
          }
        } else {
          if (oldValue !== curValue) {
            changedObj[orgColumn] = curValue;
          }
        }

      }
    });
    return changedObj;
  }

  public saveChangedData() {
    this.__clone__ = this.getDbParam();
  }

  public getOriginalData() {
    return this.__clone__;
  }

  public getDbParam() {
    return this.getSaveData(true, true);
  }

  public getFilterValue() {
    return this.getDbParam();
  }

  /**
   * 如果 removeUndefinedAndNullValue 设置为 true，则 undefined 和 null 的值是获取不到的，
   * 如果你设置了某个属性值为，''，这个属性是可以的值是可以获取到为 '' 的，如果你不想要这个属性的值，
   * 请设置这个属性为 undefined，或者删除掉这个属性的 key
   * @param isFilter 内部属性，通过 getFilterValue 方法调用时有效。
   * @param removeUndefinedAndNullValue
   * @return {{}}
   */
  public getSaveData(removeUndefinedAndNullValue: boolean, isFilter: any) {
    const data: { [index: string]: any } = {};
    const columns = this.getColumns();
    const target = this as any;
    for (const key in columns) {
      if (columns.hasOwnProperty(key)) {
        const column = columns[key].column;
        if (columns[key].childType) {
          // 如果原始数据中没有这个字段，则不存入saveData
          if (target[key]) {
            if (columns[key].type === Array) {
              data[column] = [];
              target[key].forEach((m: any) => {
                data[column].push(m.getSaveData(removeUndefinedAndNullValue, isFilter));
              });
            } else {
              data[column] = target[key].getSaveData(removeUndefinedAndNullValue, isFilter);
            }
          }
        } else {
          let value = target[key];
          if (isFilter && typeof columns[key].formatFilterValue === 'function') {
            value = columns[key].formatFilterValue.apply(null, [{
              value: target[key],
              key,
              data: this,
              columns,
            }]);
          } else if (typeof columns[key].unformatter === 'function') {
            value = columns[key].unformatter.apply(null, [{
              value: target[key],
              key,
              data: this,
              columns,
              props: columns, // TODO: 待废弃
            }]);
          }
          // 默认null或者undefined的字段会包含在返回的对象中，如果需要返回对象不返回null和undefined的值，调用方法时传true
          if (removeUndefinedAndNullValue) {
            if (typeof target[key] !== 'undefined' && target[key] !== null) {
              data[column] = value;
            }
          } else {
            data[column] = value;
          }
        }
      }
    }
    return data;
  }

  public extend(model: any) {
    const data: { [index: string]: any } = merge({}, model, {
      clone: true,
    });
    const target = this as any;
    const props = this.getColumns();
    for (const key in props) {
      if (data.hasOwnProperty(key)) {
        target[key] = data[key];
      }
    }
  }

  public getPrimaryKey() {
    const primary = [];
    const columns = this.getColumns();
    for (const columnName in columns) {
      if (columns.hasOwnProperty(columnName)) {
        const column = columns[columnName];
        if (column.primary) {
          primary.push({
            primaryKey: columnName,
            primaryColumn: column,
          });
        }
      }
    }
    if (primary.length === 0) {
      // console.log(this.constructor.name + '没有设置 primary key');
    }
    return primary;
  }

  public getPrimaryValue() {
    const target = this as any;
    const v: any[] = [];
    this.getPrimaryKey().forEach((item: any) => {
      v.push(target[item.primaryKey]);
    });
    return v.join('');
  }

  public getPrimaryValueFromData(model: any) {
    const v: any[] = [];
    this.getPrimaryKey().forEach((item) => {
      v.push(model[item.primaryColumn.column]);
    });
    return v.join('');
  }
}
