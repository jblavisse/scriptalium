// axiosInstance.ts

import axios from 'axios';

function getCookie(name: string): string | null {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(`${name}=`)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');
console.log('CSRF Token:', csrftoken);
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'X-CSRFToken': csrftoken || '',
  },
});


export default axiosInstance;
