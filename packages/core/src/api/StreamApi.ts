/**
 * @description API 封装工具类
 */
import Vue from 'vue';
import {IApi} from './IApi';

declare module 'vue/types/vue' {
  interface VueConstructor {
    http: any;
  }
}

/*

import qs from 'qs'
import instance from '@/weex/instance'
import auth from '@/utils/authUtil'
import errorUtil from '@/utils/errorUtil'

const stream = weex.requireModule('stream')

const streamUtil = {
  get (url, params) {
    return new Promise((resolve, reject) => {
      instance.getBaseUrl().then((baseUrl) => {
        auth.getAuthToken().then((authToken) => {
          stream.fetch({
            method: 'GET',
            url: `${baseUrl}${url}?${qs.stringify(params)}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            type: 'json',
            timeout: 10000
          }, res => {
            if (res.ok && res.data && res.data.result_code === 'success') {
              resolve(res.data)
            } else if (res.ok && res.data && res.data.result_code === 'resource_not_found') {
              resolve(res.data)
            } else {
              reject(res)
            }
          })
        })
      })
    })
  },

  post (url, body) {
    return new Promise((resolve, reject) => {
      let authToken = ''
      auth.getAuthToken().then((authToken_) => {
        authToken = authToken_
      }).finally(() => {
        instance.getBaseUrl().then((baseUrl) => {
          stream.fetch({
            method: 'POST',
            url: baseUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            type: 'json',
            body: JSON.stringify(body),
            timeout: 10000
          }, res => {
            if (res.ok && res.data && res.data.result_code === 'success') {
              resolve(res.data)
            } else {
              errorUtil.showErrorMessage(res, reject)
            }
          })
        })
      })
    })
  },

  del (url) {
    return new Promise(async (resolve, reject) => {
      auth.getAuthToken().then((authToken) => {
        instance.getBaseUrl().then((baseUrl) => {
          stream.fetch({
            method: 'DELETE',
            url: baseUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            type: 'json'
          }, res => {
            if (res.ok && res.data && res.data.result_code === 'success') {
              resolve(res.data)
            } else {
              errorUtil.showErrorMessage(res, reject)
            }
          })
        })
      })
    })
  },

  put (url, body) {
    return new Promise((resolve, reject) => {
      auth.getAuthToken().then((authToken) => {
        instance.getBaseUrl().then((baseUrl) => {
          stream.fetch({
            method: 'PUT',
            url: baseUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            type: 'json',
            body: JSON.stringify(body)
          }, res => {
            if (res.ok && res.data && res.data.result_code === 'success') {
              resolve(res.data)
            } else {
              errorUtil.showErrorMessage(res, reject)
            }
          })
        })
      })
    })
  },
}

export default streamUtil
*/

export class StreamApi implements IApi {
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
