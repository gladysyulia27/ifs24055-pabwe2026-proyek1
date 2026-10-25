const MAX_DIMENSION = 1200;
const WEBP_QUALITY = 0.86;

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar"));
    img.src = src;
  });
}

function scaleToFit(width: number, height: number): { width: number; height: number } {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) return { width, height };
  const ratio = MAX_DIMENSION / Math.max(width, height);
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

/** Reads an image file and returns a downscaled WebP data URL (original if canvas is unavailable). */
export async function compressImageFile(file: File): Promise<string> {
  const source = await readAsDataUrl(file);
  const img = await loadImage(source);
  const { width, height } = scaleToFit(img.width, img.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return source;

  context.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/webp", WEBP_QUALITY);
}
