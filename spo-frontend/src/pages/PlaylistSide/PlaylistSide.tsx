import { useRef, useState } from "react";
import styles from "./PlaylistSide.module.css";
import { NavLink } from "react-router";

type Playlist = { id: number; thumbnail: string; title: string };

export default function PlaylistSide() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 0, thumbnail: "🎵", title: "내가 좋아하는 플레이리스트" },
    { id: 1, thumbnail: "🎵", title: "여름 플레이리스트" },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const nextIdRef = useRef<number>(2);

  const addPlaylist = () => {
    const id = nextIdRef.current++;
    setPlaylists((prev) => {
      return [
        ...prev,
        {
          id,
          thumbnail: "🎵",
          title: `플레이리스트 #${id + 1}`,
        },
      ];
    });
  };

  const handleSidebar = () => {
    setSidebarOpen((s) => !s);
  };

  return (
    <>
      <div
        data-collapsed={sidebarOpen ? "false" : "true"}
        className={styles.playlistSideContainer}
      >
        <div className={styles.plsHeader}>
          <button onClick={handleSidebar}>사이드바</button>
          <p className={styles.plsTitle}>내 플레이리스트</p>
          <button type="button" onClick={addPlaylist}>
            {sidebarOpen ? "+만들기" : "+"}
          </button>
        </div>
        <div className={styles.playlistList}>
          {playlists.map((playlist) => (
            <NavLink
              to={`/playlist/${playlist.id}`}
              className={({ isActive }) =>
                isActive
                  ? `${styles.active} ${styles.playlistItemLink}`
                  : `${styles.playlistItemLink}`
              }
            >
              <div key={playlist.id} className={styles.playlistItem}>
                {playlist.thumbnail}
                {sidebarOpen && playlist.title}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
