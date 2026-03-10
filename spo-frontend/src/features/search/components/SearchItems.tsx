import type { ReactNode } from 'react'
import type { Item, Search } from '../../../types/search'
import styles from './SearchItems.module.css'

export default function SearchItems({
  children,
  tracks,
  id,
  addTrack,
}: {
  children?: (track: Search['items'][number]) => ReactNode
  id?: number | null
  tracks: Search | null
  addTrack?: (track: Item) => Promise<void>
}) {
  return (
    <div className={styles.trackList}>
      {tracks?.items.map((i) => (
        <div key={i.trackId} className={styles.trackRow}>
          <div className={styles.trackLeft}>
            <img
              src={i.album?.albumImages?.at(0)?.url}
              alt={i.name}
              className={styles.trackThumb}
            />

            <div className={styles.trackMeta}>
              <div className={styles.trackName}>{i.name}</div>
              <div className={styles.trackArtist}>{i.artists.at(0)?.name}</div>
            </div>
          </div>
          {children ? children(i) : null}
          <div className={styles.trackDuration}>
            {Math.floor(i.durationMs / 60000)}:
            {Math.floor((i.durationMs % 60000) / 1000)
              .toString()
              .padStart(2, '0')}
          </div>
          {id && addTrack ? (
            <div onClick={() => addTrack(i)}>추가하기</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
