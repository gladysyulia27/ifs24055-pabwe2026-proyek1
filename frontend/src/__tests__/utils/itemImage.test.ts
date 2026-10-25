import { describe, it, expect } from "vitest";
import { getItemImage } from "@/utils/itemImage";
import { Item } from "@/types";

describe("itemImage utils", () => {
  it("returns null for null, undefined, or empty input", () => {
    expect(getItemImage(null)).toBeNull();
    expect(getItemImage(undefined)).toBeNull();
    expect(getItemImage("")).toBeNull();
  });

  it("prioritizes item.image_url if present", () => {
    const itemWithUrl: Item = {
      id: 1,
      name: "kamera",
      image_url: "https://example.com/camera.png"
    } as Item;
    expect(getItemImage(itemWithUrl)).toBe("https://example.com/camera.png");
  });

  it("falls back to item name mapping if image_url is missing or empty", () => {
    const itemNoUrl: Item = {
      id: 2,
      name: "kamera",
      image_url: ""
    } as Item;
    expect(getItemImage(itemNoUrl)).toBe("/assets/kamera.png");
  });

  it("resolves exact matches in static map", () => {
    expect(getItemImage("kamera")).toBe("/assets/kamera.png");
    expect(getItemImage("bola basket")).toBe("/assets/bola basket.png");
    expect(getItemImage("gitar")).toBe("/assets/gitar.png");
    expect(getItemImage("vas bunga")).toBe("/assets/vas.png");
  });

  it("resolves partial keyword matches in static map", () => {
    expect(getItemImage("Kamera Sony Alpha A7")).toBe("/assets/kamera.png");
    expect(getItemImage("Microphone Shure SM58")).toBe("/assets/microphone.png");
    expect(getItemImage("Bola Futsal Molten")).toBe("/assets/bola futsal.png");
  });

  it("returns null if item name does not match any keyword", () => {
    expect(getItemImage("Meja Kantor Kayu Jati")).toBeNull();
    expect(getItemImage("Kursi Rapat")).toBeNull();
  });
});
