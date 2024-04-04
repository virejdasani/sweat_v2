export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface ApiError {
  status: number;
  message: string;
}
