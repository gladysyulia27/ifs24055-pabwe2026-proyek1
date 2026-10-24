/**
 * itemImage — Resolves the best available thumbnail URL for an inventory item.
 *
 * Priority order:
 *   1. `item.image_url` — user-uploaded photo stored on the server
 *   2. `itemImageMap` keyword match — built-in static asset matched by item name
 *   3. `null` — caller should render a generic icon placeholder
 *
 * The static map (`itemImageMap`) is the only source of "data statis untuk gambar item"
 * and acts as a graceful fallback for items that have not yet had a photo uploaded.
 */
import { Item } from "@/types";

export const itemImageMap: Record<string, string> = {
  kamera: "/assets/kamera.png",
  "microphone rekam": "/assets/clip mic.png",
  "clip mic": "/assets/clip mic.png",
  microphone: "/assets/microphone.png",
  speaker: "/assets/speaker.png",
  headphone: "/assets/headphone.png",
  headset: "/assets/headphone.png",
  "bola basket": "/assets/bola basket.png",
  "bola futsal": "/assets/bola futsal.png",
  raket: "/assets/raket.png",
  "raket badminton": "/assets/raket.png",
  kok: "/assets/kok.png",
  "kok badminton": "/assets/kok.png",
  shuttlecock: "/assets/kok.png",
  gitar: "/assets/gitar.png",
  bass: "/assets/bass.png",
  alkitab: "/assets/alkitab.png",
  vas: "/assets/vas.png",
  "vas bunga": "/assets/vas.png"
};

export function getItemImage(itemOrName?: Item | string | null): string | null {
  if (!itemOrName) return null;
  if (typeof itemOrName === "object") {
    if (itemOrName.image_url) return itemOrName.image_url;
    return getItemImage(itemOrName.name);
  }
  const lower = itemOrName.toLowerCase().trim();
  if (itemImageMap[lower]) return itemImageMap[lower];
  for (const [key, path] of Object.entries(itemImageMap)) {
    if (lower.includes(key)) return path;
  }
  return null;
}
