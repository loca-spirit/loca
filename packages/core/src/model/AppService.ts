import {ModelBase} from './ModelBase';
import {Column} from '../annotation/Column';

/**
 * 模型
 */
export class AppService extends ModelBase {
  @Column()
  public test!: string;
}

