/**
 * @description API 封装工具类
 */
import Vue from 'vue';
import {IApi} from '@iu/core';

declare module 'vue/types/vue' {
  interface VueConstructor {
    http: any;
  }
}

export class VueResourceApi implements IApi {
  public get(url: string, params: any, options: any) {
    return new Promise((resolve, reject) => {
      Vue.http.get(url, {
        params,
      }, options).then((res: any) => {
        if (res.ok && res.body) {
          resolve(res.body);
        } else {
          reject(res.body);
        }
      }).catch((res: any) => {
        reject(res);
      });
    });
  }

  public post(url: string, body: any, options: any) {
    return new Promise((resolve, reject) => {
      Vue.http.post(url, body, options).then((res: any) => {
        if (res.ok && res.body) {
          resolve(res.body);
        } else {
          reject(res.body);
        }
      }).catch((res: any) => {
        reject(res);
      });
    });
  }

  public del(url: string, options: any) {
    return new Promise((resolve, reject) => {
      Vue.http.delete(url, options).then((res: any) => {
        if (res.ok && res.body) {
          resolve(res.body);
        } else {
          reject(res.body);
        }
      }).catch((res: any) => {
        reject(res);
      });
    });
  }

  public put(url: string, body: any, options: any) {
    return new Promise((resolve, reject) => {
      Vue.http.put(url, body, options).then((res: any) => {
        if (res.ok && res.body && res.body.result_code === 'success') {
          resolve(res.body);
        } else {
          reject(res.body);
        }
      }).catch((res: any) => {
        reject(res);
      });
    });
  }
}
