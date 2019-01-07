import {Driver} from './Driver';

/**
 * @description BaseApi
 */
export class BaseApi {
  protected adapter: { [index: string]: any } = {};

  constructor(adapter: Driver) {
    this.adapter.api = adapter.getApi();
    this.adapter.baseUrl = adapter.getUrl();
  }

  public setApi(api: any) {
    this.adapter.api = api;
  }

  public setBaseUrl(baseUrl: any) {
    this.adapter.baseUrl = baseUrl;
  }
}

