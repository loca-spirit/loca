import {ModelBase} from './ModelBase';
import {Column} from '../annotation/Column';

/**
 * 分页模型
 */
export class Page extends ModelBase {
  @Column({name: 'page_no', default: 1})
  public pageNo!: number;

  @Column({name: 'page_size', default: 10})
  public pageSize!: number;

  @Column({name: 'page_sizes', default: [10, 20, 30, 40, 50]})
  public pageSizes!: number[];
}

