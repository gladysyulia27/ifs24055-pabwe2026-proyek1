import { describe, it, expect } from "vitest";
import { ServiceError, handleServiceError } from "@/services/errorHandler";
import { ApiError } from "@/services/api";

describe("errorHandler service", () => {
  describe("ServiceError class", () => {
    it("initializes with default status 500 and flags false", () => {
      const err = new ServiceError("Server failed");
      expect(err.message).toBe("Server failed");
      expect(err.name).toBe("ServiceError");
      expect(err.status).toBe(500);
      expect(err.isNetworkError).toBe(false);
      expect(err.isValidationError).toBe(false);
      expect(err.originalError).toBeUndefined();
    });

    it("respects custom status and option flags", () => {
      const orig = new Error("inner");
      const err = new ServiceError("Validation failed", 400, {
        isNetworkError: true,
        isValidationError: true,
        originalError: orig
      });
      expect(err.status).toBe(400);
      expect(err.isNetworkError).toBe(true);
      expect(err.isValidationError).toBe(true);
      expect(err.originalError).toBe(orig);
    });
  });

  describe("handleServiceError function", () => {
    it("re-throws existing ServiceError instance directly", () => {
      const existing = new ServiceError("Direct service error", 403);
      expect(() => handleServiceError(existing)).toThrow(existing);
    });

    it("converts ApiError to ServiceError with status and flags", () => {
      const apiErr = new ApiError("Bad request from API", 400, {
        isNetworkError: false,
        data: null
      });
      expect(() => handleServiceError(apiErr)).toThrowError(ServiceError);

      try {
        handleServiceError(apiErr);
      } catch (e: unknown) {
        const serviceErr = e as ServiceError;
        expect(serviceErr.message).toBe("Bad request from API");
        expect(serviceErr.status).toBe(400);
        expect(serviceErr.isValidationError).toBe(true);
      }

      const emptyApiErr = new ApiError("", 500);
      try {
        handleServiceError(emptyApiErr, "Fallback API msg");
      } catch (e: unknown) {
        const serviceErr = e as ServiceError;
        expect(serviceErr.message).toBe("Fallback API msg");
      }
    });

    it("converts standard Error to ServiceError", () => {
      const standardErr = new Error("Database timeout");
      try {
        handleServiceError(standardErr);
      } catch (e: unknown) {
        const serviceErr = e as ServiceError;
        expect(serviceErr.message).toBe("Database timeout");
        expect(serviceErr.status).toBe(400);
        expect(serviceErr.isValidationError).toBe(true);
      }

      const emptyStandardErr = new Error("");
      try {
        handleServiceError(emptyStandardErr, "Fallback standard msg");
      } catch (e: unknown) {
        const serviceErr = e as ServiceError;
        expect(serviceErr.message).toBe("Fallback standard msg");
      }
    });

    it("converts string error into ServiceError", () => {
      try {
        handleServiceError("String error detail");
      } catch (e: unknown) {
        const serviceErr = e as ServiceError;
        expect(serviceErr.message).toBe("String error detail");
        expect(serviceErr.status).toBe(400);
        expect(serviceErr.isValidationError).toBe(true);
      }
    });

    it("converts unknown / primitive error types into 500 ServiceError with fallback", () => {
      try {
        handleServiceError({ random: 123 }, "Fallback generic");
      } catch (e: unknown) {
        const serviceErr = e as ServiceError;
        expect(serviceErr.message).toBe("Fallback generic");
        expect(serviceErr.status).toBe(500);
      }
    });
  });
});
