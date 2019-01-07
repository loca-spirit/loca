/**
 * Gets the classname of an object or function if it can.  Otherwise returns the provided default.
 *
 * Getting the name of a function is not a standard feature, so while this will work in many
 * cases, it should not be relied upon except for informational messages (e.g. logging and Error
 * messages).
 *
 * @private
 */
export function getClassName(object: any, defaultName?: string) {
  const nameFromToStringRegex = /^function\s?([^\s(]*)/;
  let result: string | undefined = '';
  if (typeof object === 'function') {
    result = object.name || object.toString().match(nameFromToStringRegex)[1];
  } else if (typeof object.constructor === 'function') {
    result = getClassName(object.constructor, defaultName);
  }
  return result || defaultName;
}

export function formatFilterValueHandler(item: any) {
  if (item.value && Array.isArray(item.value)) {
    return item.value.join(',');
  } else {
    return item.value;
  }
}

function isObject(val: any) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function isObjectObject(o: any) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

export function isPlainObject(o: any) {
  let ctor;
  let prot;

  if (isObjectObject(o) === false) { return false; }

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') { return false; }

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) { return false; }

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}
