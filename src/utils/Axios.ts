import { GOOGLE_LOGIN } from '@/config/URLS';
import axios from 'axios';

if (import.meta.env.MODE === 'development') {
  axios.defaults.baseURL = 'http://localhost:8080/api';
} else {
  axios.defaults.baseURL = 'https://academa.bykowski.dev/api';
}

axios.defaults.maxRedirects = 0;
axios.defaults.withCredentials = true;

export const Axios = axios;

export const redirectToGoogleLogin = () => {
  localStorage.removeItem('user');
  window.location.href = `${axios.defaults.baseURL}${GOOGLE_LOGIN()}`;
};

export const catchError = <T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error]> => {
  return promise
    .then(data => [undefined, data] as [undefined, T])
    .catch(error => [error]);
};
