import type { Playlist } from "../../../../types/playlist";
import { DEFAULT_THUMBNAIL, resolveImageUrl } from "../../../../utils/image";
import styles from "../shared/SidebarList.module.css";
import { NavLink } from "react-router-dom";

interface MyPlaylistSideProps {
  playlists: Playlist[];
  sidebarOpen: boolean;
  playlistVersion: number;
}

export default function MyPlaylistSide({
  playlists,
  sidebarOpen,
  playlistVersion,
}: MyPlaylistSideProps) {
  return (
    <div className={styles.list}>
      {sidebarOpen && (
        <div className={styles.listMeta}>{playlists.length} playlists</div>
      )}

      {playlists.map((playlist) => {
        const srcThumbnailUrl = playlist.thumbnailUrl
          ? `${resolveImageUrl(playlist.thumbnailUrl)}?v=${playlistVersion}`
          : DEFAULT_THUMBNAIL;
        return (
          <NavLink
            key={playlist.id}
            to={`/detail/playlist/${playlist.id}`}
            title={!sidebarOpen ? playlist.title : undefined}
            className={({ isActive }) =>
              `${styles.itemLink} ${isActive ? styles.active : ""}`
            }
          >
            <div
              className={`${styles.item} ${!sidebarOpen ? styles.collapsedItem : ""}`}
            >
              <img
                src={srcThumbnailUrl}
                alt={playlist.title}
                className={styles.thumbnail}
              />

              {sidebarOpen && (
                <span className={styles.itemText}>{playlist.title}</span>
              )}
            </div>
          </NavLink>
        );
      })}
    </div>
  );
}
