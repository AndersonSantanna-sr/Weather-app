import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.weatherapi.com/v1',
  timeout: 10000,
});
