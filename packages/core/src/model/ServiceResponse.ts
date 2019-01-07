import {ModelBase} from './ModelBase';
import {Column} from '../annotation/Column';

/**
 * 模型
 */
export class ServiceResponse<T> extends ModelBase {
  @Column()
  public resultCode!: string;

  @Column()
  public message!: string;

  @Column()
  public data!: T;

  public isValid() {
    return this.resultCode === 'success';
  }
}

