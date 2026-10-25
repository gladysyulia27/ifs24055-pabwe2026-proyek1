import { ApiError } from "@/services/api";
import { ServiceError } from "@/services/errorHandler";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ServiceError) {
    return error.message || fallback;
  }
  if (error instanceof ApiError) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallback;
};
