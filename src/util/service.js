/* eslint no-console:off */
import * as axios from 'axios';
import { getCookie } from './cookieUtils';
import history from './history';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.API_URL + '/' + process.env.API_NAME + '/'
    : '/' + process.env.API_NAME + '/';
const BASE_API_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.API_URL + '/' + process.env.API_NAME + '/api/'
    : '/' + process.env.API_NAME + '/api/';

const AUTH = process.env.AUTH || true; // Check if authentication is enabled

export function getLoginToken(url, payload) {
  return axios.post(`${BASE_URL}${url}`, payload);
}

export function getSSOFlag(url) {
  return axios.get(`${BASE_URL}${url}`);
}

function getAuthorizationHeader() {
  const currentAuthorizationToken = getCookie('jwt');
  if (currentAuthorizationToken === null) {
    return null;
  }
  const header = { headers: { Authorization: `${currentAuthorizationToken}` } };
  return header;
}

const getApp = () => {
  const base = window.location.href.split('/')[1];
  if (base == 'expert/signup') {
    return 'expert-signup';
  }
  if (base && base.slice(0, 6) == 'expert') {
    return 'expert';
  }
  return 'main';
};

const redirectToLogin = () => {
  const redirectUrl = encodeURIComponent(window.location.hash.replace('/', ''));
  switch (getApp()) {
    case 'expert':
      history.push('/expert');
      break;
    case 'expert-signup':
      history.push('/expert/signup');
    default:
      const href = window.location.href;
      const redirectUrl = sessionStorage.getItem('redirectUrl');

      if (redirectUrl) {
        redirectUrl && sessionStorage.setItem('redirectUrl', redirectUrl);
      } else if (href.includes('survey') || href.includes('dealgametape')) {
        sessionStorage.removeItem('redirectUrl');
        sessionStorage.setItem('redirectUrl', window.location.href);
      }
      history.push(`/logout`);
      break;
  }
};

export function get(url, customHeader) {
  let header = getAuthorizationHeader();
  if (header != null) {
    if (customHeader !== null && typeof customHeader !== 'undefined') {
      header = Object.assign(customHeader, header);
    }
    const response = axios
      .get(`${BASE_API_URL}${url}`, header)
      .catch((error) => {
        const errorMessage = error.message;
        if (errorMessage !== '') {
          console.error(errorMessage);
        }
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          redirectToLogin();
        } else {
          throw error;
        }
      });
    return response;
  } else if (
    AUTH !== null &&
    typeof AUTH !== 'undefined' &&
    AUTH !== 'undefined'
  ) {
    redirectToLogin();
  }
  return axios.get(`${BASE_API_URL}${url}`, customHeader);
}

export function deleteRecord(url) {
  const header = getAuthorizationHeader();
  if (header != null) {
    const response = axios
      .delete(`${BASE_API_URL}${url}`, header)
      .catch((error) => {
        const errorMessage = error.message;
        if (errorMessage !== '') {
          console.error(errorMessage);
        }
        if (error.response.status === 401 || error.response.status === 403) {
          redirectToLogin();
        } else {
          throw error;
        }
      });
    return response;
  } else if (
    AUTH !== null &&
    typeof AUTH !== 'undefined' &&
    AUTH !== 'undefined'
  ) {
    redirectToLogin();
  }
  return axios.delete(`${BASE_API_URL}${url}`);
}

export function post(url, payload, config = '') {
  const header = getAuthorizationHeader();
  if (header != null) {
    const response = axios
      .post(`${BASE_API_URL}${url}`, payload, header)
      .catch((error) => {
        const errorMessage = error.message;
        if (errorMessage !== '') {
          console.error(errorMessage);
        }
        if (
          (error.response.status === 401 || error.response.status === 403) &&
          url !== 'user/update'
        ) {
          redirectToLogin();
        } else {
          throw error;
        }
      });
    return response;
  } else if (
    AUTH !== null &&
    typeof AUTH !== 'undefined' &&
    AUTH !== 'undefined'
  ) {
    redirectToLogin();
  }
  return axios.post(`${BASE_API_URL}${url}`, payload, config);
}

export function upload(url, payload, config = '') {
  const header = getAuthorizationHeader();
  if (header != null) {
    const response = axios
      .post(`${BASE_API_URL}${url}`, payload, config)
      .catch((error) => {
        const errorMessage = error.message;
        if (errorMessage !== '') {
          console.error(errorMessage);
        }
        if (error.response.status === 401 || error.response.status === 403) {
          redirectToLogin();
        } else {
          throw error;
        }
      });
    return response;
  } else if (
    AUTH !== null &&
    typeof AUTH !== 'undefined' &&
    AUTH !== 'undefined'
  ) {
    redirectToLogin();
  }
  return axios.post(`${BASE_API_URL}${url}`, payload, config);
}

export function put(url, payload) {
  const header = getAuthorizationHeader();
  if (header != null) {
    const response = axios
      .put(`${BASE_API_URL}${url}`, payload, header)
      .catch((error) => {
        const errorMessage = error.message;
        if (errorMessage !== '') {
          console.error(errorMessage);
        }
        if (error.response.status === 401 || error.response.status === 403) {
          redirectToLogin();
        } else {
          throw error;
        }
      });
    return response;
  } else if (
    AUTH !== null &&
    typeof AUTH !== 'undefined' &&
    AUTH !== 'undefined'
  ) {
    redirectToLogin();
  }
  return axios.put(`${BASE_API_URL}${url}`, payload);
}
