/* eslint-disable no-console */
import { api } from './client';

api.interceptors.request.use((config) => {
  if (__DEV__) console.log('🚀 Request:', config.url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) console.log('❌ Error:', error.response?.data);
    return Promise.reject(error);
  }
);
