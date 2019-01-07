/**
 * Created by shuai.meng on 2017/8/2.
 */
function create(fn: any) {
  return function createDTO(dto: any) {
    const obj = {__proto__: fn.prototype};
    fn.apply(obj, arguments);
    return obj;
  };
}

function setDefault(model: any, field: any, key: string, modelDTO: any) {
  if (typeof field.default === 'undefined') {
    model[key] = undefined;
  } else {
    if (field.childType) {
      model[key] = create(field.childType)(field.default);
    } else {
      if (typeof field.default === 'function') {
        model[key] = field.default.apply(null, [{
          key: field.column,
          data: modelDTO,
          field,
        }]);
      } else {
        model[key] = field.default;
      }
    }
  }
}

function createChildField(model: any, field: any, key: string, modelDTO: any) {
  const formatterValue = getFormatterValue(field, modelDTO);
  if (field.type === Array && Array.isArray(formatterValue)) {
    const arr: any[] = [];
    formatterValue.forEach((itemDTO: any) => {
      arr.push(create(field.childType)(itemDTO));
    });
    return arr;
  } else {
    return create(field.childType)(formatterValue);
  }
}

function getFormatterValue(field: any, modelDTO: any) {
  if (typeof field.formatter === 'function') {
    return field.formatter.apply(null, [{
      value: modelDTO[field.column],
      key: field.column,
      data: modelDTO,
      field,
    }]);
  } else {
    return modelDTO[field.column];
  }
}

function updateArrField(field: any, model: any, columnName: string, data: any) {
  if (data[field.column]) {
    if (data[field.column].length) {
      data[field.column].forEach((dto: any) => {
        let find = false;
        if (model[columnName]) {
          model[columnName].forEach((item: any) => {
            if (item.getPrimaryValue() === item.getPrimaryValueFromData(dto)) {
              item.update(dto);
              find = true;
            }
          });
          if (!find) {
            model[columnName].push(create(field.childType)(dto));
          }
        } else {
          model[columnName] = [];
          model[columnName].push(create(field.childType)(dto));
        }
      });
    } else {
      model[columnName] = [];
    }
  }
}

function initField(flag: string, columnName: string, model: any, columns: any, data: any) {
  const field = columns[columnName];
  if (flag === 'create') {
    if (data.hasOwnProperty(field.column)) {
      if (field.childType) {
        model[columnName] = createChildField(model, field, columnName, data);
      } else {
        model[columnName] = getFormatterValue(field, data);
      }
    } else {
      setDefault(model, field, columnName, data);
    }
  } else if (flag === 'update') {
    if (data.hasOwnProperty(field.column)) {
      if (field.childType) {
        if (field.type === Array) {
          updateArrField(field, model, columnName, data);
        } else if (field.foreign) {
          // 带 foreign 属性的对象会强制校验主键一致
          if (model[columnName].getPrimaryValueFromData(data[field.column])) {
            // 判断之前是否有值，如果没有值则创建
            if (model[columnName]) {
              // 判断之前的值是否和新的值相等，一致则更新
              if (model[columnName].getPrimaryValue() ===
                model[columnName].getPrimaryValueFromData(data[field.column])) {
                model[columnName].update(data[field.column]);
              } else {
                // TODO: 此处不应该 create
                model[columnName] = create(field.childType)(data[field.column]);
              }
            } else {
              model[columnName] = create(field.childType)(data[field.column]);
            }
          }
        } else {
          // 是否应该删除
          if (data[field.column]) {
            if (typeof model[columnName] !== 'undefined' && model[columnName].update) {
              model[columnName].update(data[field.column]);
            } else {
              model[columnName] = create(field.childType)(data[field.column]);
            }
          }
        }
      } else {
        model[columnName] = getFormatterValue(field, data);
      }
    }
  }
}

function setModelByDTO(flag: string, model: any, props: any, modelDTO: any) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      initField(flag, key, model, props, modelDTO);
    }
  }
  model.saveChangedData();
}

// export split =========================

export function createModelByDTO(model: any, props: any, dto: any) {
  // 初始化的时候可以是空
  const modelDTO: { [index: string]: any } = dto || {};
  setModelByDTO('create', model, props, modelDTO);
}

export function updateModelByDTO(model: any, props: any, dto: any) {
  // 更新的时候可以是空
  const modelDTO = dto || {};
  setModelByDTO('update', model, props, modelDTO);
}

export function mappingData(data: { [index: string]: any }, mapping: { [index: string]: any }) {
  const params: { [index: string]: any } = {};
  for (const key in mapping) {
    if (typeof data[key] !== 'undefined') {
      params[mapping[key]] = data[key];
    }
  }
  return params;
}
