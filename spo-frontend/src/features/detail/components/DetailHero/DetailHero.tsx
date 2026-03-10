import type React from 'react'
import type { Detail } from '../../../../page/PlaylistDetailPage'
import styles from './DetailHero.module.css'

interface DetailHeroProps {
  srcThumbnailUrl: string
  onEditClick?: () => void
  isOwner: boolean
  source: string | null
  detail: Detail
  trackCount: number
  moreSlot?: React.ReactNode
}
export default function DetailHero({
  srcThumbnailUrl,
  onEditClick,
  isOwner,
  source,
  detail,
  trackCount,
  moreSlot,
}: DetailHeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <img
          src={srcThumbnailUrl}
          alt=""
          className={styles.thumbnail}
          onClick={isOwner ? onEditClick : undefined}
        />

        <div className={styles.headerInfo}>
          <div className={styles.badge}>
            {source === 'playlist'
              ? detail.visibility === 'PRIVATE'
                ? '비공개 플레이리스트'
                : '공개 플레이리스트'
              : '플리 요청'}
          </div>
          <h2
            className={styles.detailTitle}
            onClick={isOwner ? onEditClick : undefined}
          >
            {detail?.title}
          </h2>

          <div className={styles.meta}>
            <span className={styles.metaUser}>{detail.username}</span>
            <span className={styles.dot}>•</span>
            <span>{trackCount}곡</span>
          </div>

          {moreSlot}
        </div>
      </div>
    </div>
  )
}
