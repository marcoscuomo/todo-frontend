import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

import { logout } from '../contexts/AuthContext';
import { AuthTokenError } from '../errors/AuthTokenError';

let isRefrshing = false;
let failedRequestQueue: any = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333/',
    headers: {
      Authorization: `Bearer ${cookies['authnext-token']}`
    }
  });

  api.interceptors.response.use(response => {
    return response;
  }, (error) => {
    if(error.response.status === 401){
      if(error.response.data.message.name === 'TokenExpiredError'){
        console.log();
        cookies = parseCookies(ctx);

        const { 'authnext-refreshToken': refreshToken } = cookies;

        const originalConfig = error.config;

        if(!isRefrshing) {
          isRefrshing = true;
          api.post('user/refresh-token', {token: refreshToken}).then((response: any) => {
            const token = response.data.token

            setCookie(ctx, 'authnext-token', token, {
              maxAge: 60 * 60 * 1, //1 hour
              path: '/'
            });

            setCookie(ctx, 'authnext-refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, //30 days
              path: "/",
            });

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            failedRequestQueue?.forEach((request: any) => request.onSuccess(token));
            failedRequestQueue = [];
          }).catch(err => {
            
            failedRequestQueue?.forEach((request: any) => request.onFailure(err));
            failedRequestQueue = [];

            if(typeof window === 'undefined') {
              logout();
            }
          }).finally(() => {
            isRefrshing = false;
          });

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`
                resolve(api(originalConfig))
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              }
            });
          });
        }
      } else {
        if(typeof window === 'undefined') {
          logout();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }
    }

    return Promise.reject(error);
  });

  return api;
}
