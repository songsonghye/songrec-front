import type { SectionItem } from "../../../../types/section";
import { DEFAULT_THUMBNAIL, resolveImageUrl } from "../../../../utils/image";
import styles from "./PlaylistResSectionCard.module.css";

interface PlaylistResSectionProps {
  items: SectionItem[];
  featured?: boolean;
  handlePlaylist: (playlistId: number) => void;
  playlistVersion: number;
}
export default function PlaylistResSectionCard({
  items,
  featured,
  handlePlaylist,
  playlistVersion,
}: PlaylistResSectionProps) {
  return (
    <>
      {items.map((item) => {
        const srcThumbnailUrl = item.thumbnailUrl
          ? `${resolveImageUrl(item.thumbnailUrl)}?v=${playlistVersion}`
          : DEFAULT_THUMBNAIL;
        return (
          <div
            key={item.id}
            className={`${styles.card} ${featured ? styles.featuredCard : ""}`}
            onClick={() => handlePlaylist(item.id)}
          >
            <div className={styles.thumbnailWrap}>
              <img
                src={srcThumbnailUrl}
                alt={item.title}
                className={styles.thumbnail}
              />
            </div>

            <div className={styles.title}>{item.title}</div>
            <div className={styles.creator}>{item.creator}</div>
          </div>
        );
      })}
    </>
  );
}
