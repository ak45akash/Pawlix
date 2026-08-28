import Image from "next/image";
import { isLocalImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils/cn";

export function SmartImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  if (!src) {
    return <div className={cn("bg-canvas", fill && "absolute inset-0", className)} aria-hidden />;
  }

  if (isLocalImageSrc(src)) {
    return (
      // User-uploaded data URLs cannot go through next/image.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill && "absolute inset-0 size-full object-cover", className)}
      />
    );
  }

  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
