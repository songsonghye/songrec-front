import type { Request } from '../../../../types/request'
import { DEFAULT_THUMBNAIL } from '../../PlaylistSide'
import styles from './RequestPlaylistSide.module.css'
import { NavLink } from 'react-router-dom'

interface RequestPlaylistSideProps {
  requests: Request[]
  sidebarOpen: boolean
  playlistVersion: number
}

export default function RequestPlaylistSide({
  requests,
  sidebarOpen,
  playlistVersion,
}: RequestPlaylistSideProps) {
  return (
    <div className={styles.requestList}>
      {requests.map((request) => (
        <NavLink
          key={request.id}
          to={`/detail/request/${request.id}`}
          className={({ isActive }) =>
            isActive
              ? `${styles.active} ${styles.requestItemLink}`
              : `${styles.requestItemLink}`
          }
        >
          <div className={styles.requestItem}>
            <img
              src={
                request.thumbnailUrl
                  ? `${import.meta.env.VITE_API_URL}${request.thumbnailUrl}?v=${playlistVersion}`
                  : DEFAULT_THUMBNAIL
              }
              alt=""
              className={styles.thumbnail}
            />
            {sidebarOpen && request.title}
          </div>
        </NavLink>
      ))}
    </div>
  )
}
