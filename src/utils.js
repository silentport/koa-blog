import { host } from './config';

export const request = (params) => {
  const { path, data, method } = params
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  return new Promise((resolve, reject) => {
    const option = method === 'POST' ? {
      credentials: 'include',
      method: method,
      body: formData,
    } : {
      credentials: 'include',
      method: method,
    };

    fetch(`${host}/api/${path}`, option).then(res => {
        return res.json();
      })
      .then(res => {
        if (res.info && res.info.status) {
          resolve({ ...res.data,
            msg: res.info.msg
          });
        } else {
          reject(res.info && res.info.msg)
        }
      }).catch(err => {
        reject('请求错误');
      })
  })
}
