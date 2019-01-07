import { ModelBase } from './ModelBase';
/**
 * 模型
 */
export declare class ServiceResponse<T> extends ModelBase {
    resultCode: string;
    message: string;
    data: T;
    isValid(): boolean;
}
