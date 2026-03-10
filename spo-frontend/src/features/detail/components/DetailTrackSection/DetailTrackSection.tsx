import { IoHeart } from 'react-icons/io5'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import styles from './DetailTrackSection.module.css'
import type { Track } from '../../../../types/track'
import {
  getTrackMenuActions,
  type TrackMenuAction,
} from '../../policies/trackMenuActions'

interface DetailTrackSectionProps {
  source: string | null
  isOwner: boolean
  tracks: Track[]
  deleteTrack: (trackId: number) => Promise<void>
}

export default function DetailTrackSection({
  source,
  isOwner,
  tracks,
  deleteTrack,
}: DetailTrackSectionProps) {
  return (
    <div className={styles.body}>
      <div className={styles.trackHeader}>
        <div className={styles.colIndex}>#</div>
        <div className={styles.colTitle}>제목</div>
        <div className={styles.colMeta}>아티스트</div>
        <div className={styles.colRight}>길이</div>
        <div className={styles.colLike}></div>
        <div className={styles.colMore}></div>
      </div>

      <div className={styles.trackList}>
        {tracks.map((track, idx) => {
          const actions: TrackMenuAction[] = getTrackMenuActions({
            source,
            isOwner,
            trackId: track.trackId,
            onDeleteTrack: deleteTrack,
          })
          return (
            <div key={track.trackId} className={styles.trackRow}>
              <div className={styles.colIndex}>{idx + 1}</div>
              <div className={styles.colTitle}>
                <div className={styles.trackName}>{track.name}</div>
              </div>
              <div className={styles.colMeta}>{track.artist ?? '-'}</div>
              <div className={styles.colRight}>
                <span className={styles.duration}>
                  {Math.floor(track.durationMs / 60000)}:
                  {Math.floor((track.durationMs % 60000) / 1000)
                    .toString()
                    .padStart(2, '0')}
                </span>
              </div>
              <IoHeart color="red" size="20px" />

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className={styles.moreButton}>•••</button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                  className={styles.dropdownContent}
                  side="bottom"
                  align="end"
                  sideOffset={19}
                  collisionPadding={3}
                  sticky="always"
                >
                  {actions.map((a) => (
                    <DropdownMenu.Item asChild key={a.key}>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={a.onSelect}
                      >
                        {a.label}
                      </button>
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator
                    className={styles.dropdownSeparator}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          )
        })}
      </div>
    </div>
  )
}
