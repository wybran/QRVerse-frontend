import { GOOGLE_LOGIN } from '@/config/URLS';
import axios from 'axios';

if (import.meta.env.MODE === 'development') {
  axios.defaults.baseURL = 'http://localhost:8080/api';
} else {
  axios.defaults.baseURL = 'https://api-qr.wybran.dev/api';
}

axios.defaults.maxRedirects = 0;
axios.defaults.withCredentials = true;

export const Axios = axios;

export const redirectToGoogleLogin = () => {
  console.log('Redirecting to Google Login');
  localStorage.removeItem('user');
  window.location.href = `${axios.defaults.baseURL}${GOOGLE_LOGIN()}`;
};

export const catchError = async <T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error, number?]> => {
  try {
    const data = await promise;
    return [undefined, data];
  } catch (error: any) {
    if (error.response) {
      return [error, error.response.status];
    }
    return [error];
  }
};
