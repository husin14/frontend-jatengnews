import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseURL) {
  console.warn('Warning: NEXT_PUBLIC_BASE_URL is not defined in environment variables.');
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for detailed error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const { config, response } = error;
      const url = config?.url ? `${config.baseURL || ''}${config.url}` : 'unknown URL';
      const status = response?.status || 'No status code';
      const message = error.message || 'An unknown error occurred';

      console.error(`[API Error] URL: ${url}`);
      console.error(`[API Error] Status: ${status}`);
      console.error(`[API Error] Message: ${message}`);

      if (status === 404) {
        console.error(`[API Error] Possible Cause: The endpoint does not exist or NEXT_PUBLIC_BASE_URL is misconfigured.`);
      }
    } else {
      console.error('[API Error] Non-Axios error occurred:', error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
