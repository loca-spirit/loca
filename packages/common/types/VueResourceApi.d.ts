import { IApi } from '@iu/core';
declare module 'vue/types/vue' {
    interface VueConstructor {
        http: any;
    }
}
export declare class VueResourceApi implements IApi {
    get(url: string, params: any, options: any): Promise<{}>;
    post(url: string, body: any, options: any): Promise<{}>;
    del(url: string, options: any): Promise<{}>;
    put(url: string, body: any, options: any): Promise<{}>;
}
