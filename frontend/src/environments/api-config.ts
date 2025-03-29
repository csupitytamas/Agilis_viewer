const BASE_URL = window.location.origin;
console.log('BASE_URL', BASE_URL);

export const PRESENTER_API_URL = 'https://dev.backend.demosystems.hu/api/v1';
export const SLIDEMAKER_API_URL = 'https://slidemaker-backend.onrender.com/';
export const BACKEND_API_URL = 'http://localhost:3000';

export const BACKEND_HOST_API_URL = `backend.${BASE_URL}/api`;
console.log('BACKEND_HOST_API_URL', BACKEND_HOST_API_URL);

export const BACKEND_PROXY_API_URL = `${BASE_URL}/api`;
export const PRESENTER_PROXY_API_URL = `${BASE_URL}/api/v1`;
export const SLIDEMAKER_PROXY_API_URL = `${BASE_URL}`;
