import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiError, ApiErrorResponse } from './types';

const createHttpClient = (): AxiosInstance => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const httpClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Internal Server Error',
      };
      return Promise.reject(apiError);
    },
  );

  return httpClient;
};

export default createHttpClient();
