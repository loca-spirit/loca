import 'reflect-metadata';

/*
  number serialized as Number
  string serialized as String
  boolean serialized as Boolean
  any serialized as Object
  void serializes as undefined
  Array serialized as Array
  If a Tuple, serialized as Array
  If a class serialized it as the class constructor
  If an Enum serialized it as Number
  If has at least one call signature, serialized as Function
  Otherwise serialized as Object (Including interfaces)
*/
export function Column(params?: {
  name?: string,
  childType?: any,
  formatter?: any,
  primary?: boolean,
  default?: any,
  formatFilterValue?: any,
  formatDbParam?: any,
  unformatter?: any,
}): any {
  return (target: any, property: string, descriptor: PropertyDescriptor) => {
    // target.columns = target.columns || {};
    const className = target.constructor.prototype.getClassName() || '';
    target.constructor[className] = target.constructor[className] || {};
    target.constructor[className].columns = target.constructor[className].columns || {};
    if (!params) {
      params = {};
    }
    if (params && !params.hasOwnProperty('name')) {
      let UnderlineProp = '';
      for (const char of property) {
        if (/[A-Z]/.test(char)) {
          UnderlineProp += '_';
          UnderlineProp += char.toLowerCase();
        } else {
          UnderlineProp += char;
        }
      }
      params.name = UnderlineProp;
    }
    const type = Reflect.getMetadata('design:type', target, property);
    let childType;
    switch (type) {
      case Array:
        if (params.childType) {
          childType = params.childType;
        }
        break;
      case Number:
      case String:
      case Boolean:
      case Object:
      case Function:
        // to do nothing;
        break;
      default:
        // TODO: 兼容旧版本 modelBase 除了基本类型之外，其他的复杂类型都是设置为 type
        childType = type;
    }
    target.constructor[className].columns[property] = {
      column: params.name,
      type,
      formatFilterValue: params.formatFilterValue,
      formatDbParam: params.formatDbParam,
      formatter: params.formatter,
      primary: params.primary,
      default: params.default,
      unformatter: params.unformatter,
      childType,
    };
  };
}
