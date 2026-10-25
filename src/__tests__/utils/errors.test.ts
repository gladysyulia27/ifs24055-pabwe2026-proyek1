import { describe, it, expect } from "vitest";
import { getErrorMessage } from "@/utils/errors";
import { ServiceError } from "@/services/errorHandler";
import { ApiError } from "@/services/api";

describe("errors utils", () => {
  it("extracts message from ServiceError", () => {
    const err = new ServiceError("Custom service failure", 400);
    expect(getErrorMessage(err, "Fallback")).toBe("Custom service failure");

    const emptyErr = new ServiceError("", 500);
    expect(getErrorMessage(emptyErr, "Fallback")).toBe("Fallback");
  });

  it("extracts message from ApiError", () => {
    const err = new ApiError("API server error", 500);
    expect(getErrorMessage(err, "Fallback")).toBe("API server error");

    const emptyErr = new ApiError("", 500);
    expect(getErrorMessage(emptyErr, "Fallback")).toBe("Fallback");
  });

  it("extracts message from standard Error", () => {
    const err = new Error("Standard JS error");
    expect(getErrorMessage(err, "Fallback")).toBe("Standard JS error");

    const emptyErr = new Error("");
    expect(getErrorMessage(emptyErr, "Fallback")).toBe("Fallback");
  });

  it("returns string error as is", () => {
    expect(getErrorMessage("Raw error string", "Fallback")).toBe("Raw error string");
  });

  it("returns fallback for non-error types", () => {
    expect(getErrorMessage(null, "Fallback")).toBe("Fallback");
    expect(getErrorMessage(undefined, "Fallback")).toBe("Fallback");
    expect(getErrorMessage(12345, "Fallback")).toBe("Fallback");
    expect(getErrorMessage({ custom: "obj" }, "Fallback")).toBe("Fallback");
  });
});
