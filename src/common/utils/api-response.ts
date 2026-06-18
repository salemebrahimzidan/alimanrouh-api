import { ApiResponse } from '../interfaces/api-response.interface';

export function successResponse<T>(
  message: string,
  data: T,
  meta?: ApiResponse<T>['meta'],
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}