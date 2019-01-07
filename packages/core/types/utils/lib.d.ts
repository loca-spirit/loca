/**
 * Gets the classname of an object or function if it can.  Otherwise returns the provided default.
 *
 * Getting the name of a function is not a standard feature, so while this will work in many
 * cases, it should not be relied upon except for informational messages (e.g. logging and Error
 * messages).
 *
 * @private
 */
export declare function getClassName(object: any, defaultName?: string): string | undefined;
export declare function formatFilterValueHandler(item: any): any;
export declare function isPlainObject(o: any): boolean;
