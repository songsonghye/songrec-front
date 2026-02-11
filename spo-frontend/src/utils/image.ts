const apiUrl = import.meta.env.VITE_API_URL;
const DEFAULT_THUMBNAIL = "../../../public/images/default-music-icon.png";

export function resolveImageUrl(thumbnailUrl?:string|null){
    if(!thumbnailUrl) return DEFAULT_THUMBNAIL;
    if(thumbnailUrl.startsWith("http")) return thumbnailUrl;
    return `${apiUrl}${thumbnailUrl}`;
}