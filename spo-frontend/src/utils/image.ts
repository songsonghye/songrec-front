const apiUrl = import.meta.env.VITE_S3_THUMBNAIL_UPLOAD_URL;
export const DEFAULT_THUMBNAIL = "/images/default-music-icon.svg";
export const DEFAULT_REQUEST_THUMBNAIL = "/images/default-request-icon.svg";
export const PLUS_THUMBNAIL = "/images/plus-icon.png";

export function resolveImageUrl(thumbnailUrl?: string | null) {
  if (!thumbnailUrl) return DEFAULT_THUMBNAIL;
  if (thumbnailUrl.startsWith("http") || thumbnailUrl.startsWith("https"))
    return thumbnailUrl;
  return `${apiUrl}${thumbnailUrl}`;
}
