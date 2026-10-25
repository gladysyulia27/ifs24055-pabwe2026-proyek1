import { describe, it, expect } from "vitest";
import {
  getDepartmentIcon,
  getDepartmentColor,
  departmentColor,
  departmentIcon
} from "@/utils/departmentStyles";
import { Package, Camera, Computer } from "lucide-react";

describe("departmentStyles utils", () => {
  it("returns correct icon for registered departments", () => {
    expect(getDepartmentIcon("DEPKOMINFO")).toBe(Camera);
    expect(getDepartmentIcon("DIPTEK")).toBe(Computer);
  });

  it("returns fallback Package icon when department is unknown, empty, or undefined", () => {
    expect(getDepartmentIcon("UNKNOWN_DEPT")).toBe(Package);
    expect(getDepartmentIcon("")).toBe(Package);
    expect(getDepartmentIcon(undefined)).toBe(Package);
  });

  it("returns correct color string for registered departments", () => {
    expect(getDepartmentColor("DEPKOMINFO")).toBe("blue");
    expect(getDepartmentColor("DIPTEK")).toBe("purple");
    expect(getDepartmentColor("DEPAGSOS")).toBe("pink");
  });

  it("returns fallback 'blue' color when department is unknown, empty, or undefined", () => {
    expect(getDepartmentColor("UNKNOWN_DEPT")).toBe("blue");
    expect(getDepartmentColor("")).toBe("blue");
    expect(getDepartmentColor(undefined)).toBe("blue");
  });
});
