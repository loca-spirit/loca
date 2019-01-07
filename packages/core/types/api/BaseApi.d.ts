import { Driver } from './Driver';
/**
 * @description BaseApi
 */
export declare class BaseApi {
    protected adapter: {
        [index: string]: any;
    };
    constructor(adapter: Driver);
    setApi(api: any): void;
    setBaseUrl(baseUrl: any): void;
}
