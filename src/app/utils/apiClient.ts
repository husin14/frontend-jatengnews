import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseURL) {
  console.warn('Warning: NEXT_PUBLIC_BASE_URL is not defined in environment variables.');
}

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetryableConfig = InternalAxiosRequestConfig & { __retryCount?: number };

const MAX_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 800;

function getRetryDelayMs(error: AxiosError, retryCount: number): number {
  const headers = error.response?.headers as Record<string, unknown> | undefined;
  const retryAfter = Number(headers?.['retry-after']);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.min(retryAfter * 1000, 5000);
  }

  return Math.min(BASE_RETRY_DELAY_MS * retryCount, 3000);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Interceptor for retry + detailed error logging
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const isRetryableStatus = status === 429 || (typeof status === 'number' && status >= 500);
    const isRetryableNetworkError = !error.response && error.code !== 'ECONNABORTED';
    const isGetRequest = config?.method?.toLowerCase() === 'get';

    if (config && isGetRequest && (isRetryableStatus || isRetryableNetworkError)) {
      config.__retryCount = config.__retryCount ?? 0;

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        await wait(getRetryDelayMs(error, config.__retryCount));
        return apiClient(config);
      }
    }

    if (axios.isAxiosError(error)) {
      const { config: errorConfig, response } = error;
      const url = errorConfig?.url
        ? `${errorConfig.baseURL || ''}${errorConfig.url}`
        : 'unknown URL';
      const statusCode = response?.status || 'No status code';
      const message = error.message || 'An unknown error occurred';

      console.error(`[API Error] URL: ${url}`);
      console.error(`[API Error] Status: ${statusCode}`);
      console.error(`[API Error] Message: ${message}`);

      if (statusCode === 404) {
        console.error(
          `[API Error] Possible Cause: The endpoint does not exist or NEXT_PUBLIC_BASE_URL is misconfigured.`
        );
      }

      if (statusCode === 429) {
        console.error(
          `[API Error] Possible Cause: Rate limit exceeded. Check API_RATE_LIMIT on the backend.`
        );
      }
    } else {
      console.error('[API Error] Non-Axios error occurred:', error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Gagal memuat data. Silakan coba lagi nanti.'
): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return 'Server sedang sibuk. Silakan coba lagi beberapa saat lagi.';
    }

    if (!error.response) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi.';
    }
  }

  return fallback;
}
