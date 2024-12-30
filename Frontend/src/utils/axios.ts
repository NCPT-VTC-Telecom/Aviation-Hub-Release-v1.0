import axios from 'axios';

const axiosServices = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_TEST
});

let lastAlertTime = 0;
const alertCoolDown = 1000;
let alertShown = false; // Flag to prevent multiple alerts
let redirecting = false; // New flag to prevent multiple redirects

axiosServices.interceptors.response.use(
  (response: any) => {
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format.');
    }

    if (response.data.code === -3) {
      const now = Date.now();
      if (now - lastAlertTime > alertCoolDown && !alertShown && !redirecting) {
        alertShown = true;
        redirecting = true;
        setTimeout(() => {
          alert("You don't have permission");
          window.location.href = '/login';
        }, 100); // Short delay to allow other responses to be processed
        lastAlertTime = now;
      }
      throw new Error('Permission denied');
    } else {
      return response;
    }
  },
  (error: any) => {
    if (error.response && error.response.status === 500) {
      window.location.href = '/maintenance/500';
      return Promise.reject({ error: 'Server error: Please try again later.' });
    } else if (error.response) {
      return Promise.reject({ error: 'There was a problem retrieving data. Please try again later.' });
    } else if (error.request) {
      return Promise.reject({ error: 'Unable to connect to the data server. Please check your internet connection.' });
    } else {
      return Promise.reject({ error: 'An unexpected error occurred. Please try again.' });
    }
  }
);

// Reset flags after navigation
window.addEventListener('popstate', () => {
  alertShown = false;
  redirecting = false;
});

export default axiosServices;
