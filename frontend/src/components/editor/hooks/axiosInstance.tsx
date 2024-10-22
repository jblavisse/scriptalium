import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  baseURL: `${apiUrl}/`,
  withCredentials: true, 
  headers: {
    'X-CSRFToken': csrftoken || '',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
