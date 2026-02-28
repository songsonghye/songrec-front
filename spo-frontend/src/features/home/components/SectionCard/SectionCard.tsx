import { useNavigate } from 'react-router-dom'
import { DEFAULT_THUMBNAIL } from '../../../../widgets/PlaylistSide/PlaylistSide'
import styles from './SectionCard.module.css'
import type { SectionItem } from '../../../../types/section'

interface SectionCardProps {
  sectionTitle: string
  sectionItems: SectionItem[]
  playlistVersion: number
}

export default function SectionCard({
  sectionTitle,
  sectionItems,
  playlistVersion,
}: SectionCardProps) {
  const navigate = useNavigate()
  const handleSection = (category: string) => {
    navigate(`/section/${category}`)
  }
  const handlePlaylist = (playlistId: number) => {
    navigate(`/detail/playlist/${playlistId}`)
  }
  return (
    <div>
      <h1>{sectionTitle}</h1>
      <button onClick={() => handleSection(sectionTitle)}>더보기</button>
      {sectionItems.map((sectionItem) => (
        <div
          key={sectionItem.id}
          className={styles.card}
          onClick={() => handlePlaylist(sectionItem.id)}
        >
          <img
            src={
              sectionItem.thumbnailUrl
                ? `${import.meta.env.VITE_API_URL}${sectionItem.thumbnailUrl}?v=${playlistVersion}`
                : DEFAULT_THUMBNAIL
            }
            alt=""
            className={styles.thumbnail}
          />
          <div>{sectionItem.title}</div>
          <div>{sectionItem.creator}</div>
        </div>
      ))}
    </div>
  )
}
