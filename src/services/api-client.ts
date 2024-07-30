import axios from 'axios';

const apiClient = axios.create({
  baseURL:process.env.REACT_APP_NODE_ENV !== 'development' ? 'https://10.10.248.174:4000' : 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the access token in headers
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken'); // Retrieve access token from storage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
