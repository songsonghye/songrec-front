import type { Playlist } from '../../../../types/playlist'
import { DEFAULT_THUMBNAIL } from '../../../../widgets/PlaylistSide/PlaylistSide'
import styles from './MyPlaylistSide.module.css'
import { NavLink } from 'react-router-dom'

interface MyPlaylistSideProps {
  playlists: Playlist[]
  sidebarOpen: boolean
  playlistVersion: number
}

export default function MyPlaylistSide({
  playlists,
  sidebarOpen,
  playlistVersion,
}: MyPlaylistSideProps) {
  return (
    <div className={styles.playlist}>
      {playlists.map((playlist) => (
        <NavLink
          key={playlist.id}
          to={`/detail/playlist/${playlist.id}`}
          className={({ isActive }) =>
            isActive
              ? `${styles.active} ${styles.playlistItemLink}`
              : `${styles.playlistItemLink}`
          }
        >
          <div className={styles.playlistItem}>
            <img
              src={
                playlist.thumbnailUrl
                  ? `${import.meta.env.VITE_API_URL}${playlist.thumbnailUrl}?v=${playlistVersion}`
                  : DEFAULT_THUMBNAIL
              }
              alt=""
              className={styles.thumbnail}
            />
            {sidebarOpen && playlist.title}
          </div>
        </NavLink>
      ))}
    </div>
  )
}
