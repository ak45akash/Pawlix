export type OptimizedImage = {
  dataUrl: string;
  width: number;
  height: number;
  originalBytes: number;
  optimizedBytes: number;
  mime: string;
  optimized: boolean;
};

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function dataUrlBytes(dataUrl: string) {
  const comma = dataUrl.indexOf(",");
  const payload = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.ceil((payload.length * 3) / 4);
}

export function isLocalImageSrc(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that image."));
    image.src = src;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement, mime: string, quality: number) {
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not encode the image."));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      },
      mime,
      quality,
    );
  });
}

export async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function optimizeImage(
  file: File,
  options?: { enabled?: boolean; maxEdge?: number; quality?: number },
): Promise<OptimizedImage> {
  const originalBytes = file.size;
  const source = await fileToDataUrl(file);

  if (options?.enabled === false) {
    const image = await loadImage(source);
    return {
      dataUrl: source,
      width: image.naturalWidth,
      height: image.naturalHeight,
      originalBytes,
      optimizedBytes: originalBytes,
      mime: file.type || "image/jpeg",
      optimized: false,
    };
  }

  const image = await loadImage(source);
  const maxEdge = options?.maxEdge ?? 1400;
  const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not draw the image.");
  context.drawImage(image, 0, 0, width, height);

  const quality = options?.quality ?? 0.72;
  let mime = "image/webp";
  let dataUrl = await canvasToDataUrl(canvas, mime, quality);
  if (!dataUrl.startsWith("data:image/webp")) {
    mime = "image/jpeg";
    dataUrl = await canvasToDataUrl(canvas, mime, quality);
  }

  const optimizedBytes = dataUrlBytes(dataUrl);
  if (optimizedBytes >= originalBytes && scale >= 1) {
    return {
      dataUrl: source,
      width: image.naturalWidth,
      height: image.naturalHeight,
      originalBytes,
      optimizedBytes: originalBytes,
      mime: file.type || mime,
      optimized: false,
    };
  }

  return {
    dataUrl,
    width,
    height,
    originalBytes,
    optimizedBytes,
    mime,
    optimized: true,
  };
}
