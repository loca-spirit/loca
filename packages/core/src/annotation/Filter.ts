import 'reflect-metadata';

export function Filter(params: any): any {
  return (target: any, property: string, descriptor: PropertyDescriptor) => {
    target.name = target.name || {};
    const type = Reflect.getMetadata('design:type', target, property);
    target.filters[property] = {
      name: params.name,
    };
  };
}
