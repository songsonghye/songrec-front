import { useNavigate } from 'react-router-dom'
import styles from './SectionCard.module.css'
import type { SectionItem } from '../../../../types/section'
import { useEffect, useState } from 'react'
import { sections } from '../../config/section.config'
import { DEFAULT_THUMBNAIL } from '../../../../utils/image'

interface SectionCardProps {
  sectionId: number
  playlistVersion: number
}

export default function SectionCard({
  sectionId,
  playlistVersion,
}: SectionCardProps) {
  const sectionIdx = sectionId - 1
  const [items, setItems] = useState<SectionItem[]>([])
  const navigate = useNavigate()
  const handleSection = (id: number) => {
    navigate(`/section/${id}`)
  }
  const handlePlaylist = (playlistId: number) => {
    navigate(`/detail/playlist/${playlistId}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      const section = sections.at(sectionIdx)
      if (!section) return
      const res = await section.fetch()
      setItems(res.slice(0, 10))
    }
    fetchData()
  }, [sectionIdx])

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {sections.at(sectionIdx)?.title}
        </h2>
        <button
          className={styles.moreBtn}
          onClick={() => handleSection(sectionId)}
        >
          더보기
        </button>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => handlePlaylist(item.id)}
          >
            <img
              src={
                item.thumbnailUrl
                  ? `${import.meta.env.VITE_API_URL}${item.thumbnailUrl}?v=${playlistVersion}`
                  : DEFAULT_THUMBNAIL
              }
              alt=""
              className={styles.thumbnail}
            />
            <div className={styles.title}>{item.title}</div>
            <div className={styles.creator}>{item.creator}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
