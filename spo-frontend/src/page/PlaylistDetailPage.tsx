import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import {
  deleteRequest,
  getRequestDetails,
  getRequestTracks,
  updateRequestTitle,
  uploadRequestThumbnail,
} from '../features/request/api/RequestApi'
import styles from '../features/playlists/components/PlaylistDetail/PlaylistDetail.module.css'
import PlaylistEditModal from '../shared/modals/PlaylistEditModal'
import { DEFAULT_THUMBNAIL } from '../widgets/PlaylistSide/PlaylistSide'
import type { Track } from '../types/track'
import {
  deletePlaylist,
  getPlaylistDetails,
  getPlaylistTracks,
  updatePlaylistTitle,
  uploadPlaylistThumbnail,
} from '../features/playlists/api/PlaylistApi'
import type { RequestDetail } from '../types/request'
import type { Playlist } from '../types/playlist'

type Source = 'playlist' | 'request'
type Detail = { title: string; thumbnailUrl: string | null }
const isSource = (s: string | undefined): s is Source =>
  s === 'playlist' || s === 'request'

export default function PlaylistDetailPage() {
  const { source, id } = useParams()
  const numericId = Number(id)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { refreshPlaylists } = useOutletContext<{
    refreshPlaylists: () => void
    playlistVersion: number
  }>()
  const navigate = useNavigate()
  const thumbnailUrl = detail?.thumbnailUrl

  const srcThumbnailUrl = thumbnailUrl
    ? `${import.meta.env.VITE_API_URL}${thumbnailUrl}?v=${refreshKey}`
    : DEFAULT_THUMBNAIL

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)
  const reload = useCallback(async () => {
    if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
      return

    setIsLoading(true)
    try {
      if (source === 'request') {
        const [reqRes, traRes] = await Promise.all([
          getRequestDetails(numericId),
          getRequestTracks(numericId),
        ])
        const req = reqRes.data as RequestDetail

        setDetail({
          title: req.title,
          thumbnailUrl: req.thumbnailUrl ?? null,
        })
        setTracks(traRes.data)
      } else if (source === 'playlist') {
        const [plsRes, traRes] = await Promise.all([
          getPlaylistDetails(numericId),
          getPlaylistTracks(numericId),
        ])
        const req = plsRes.data as Playlist

        setDetail({
          title: req.title,
          thumbnailUrl: req.thumbnailUrl ?? null,
        })
        setTracks(traRes.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [source, numericId])

  const uploadThumbnail = useCallback(
    async (file: File) => {
      if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
        return

      if (source === 'request') {
        await uploadRequestThumbnail(numericId, file)
      } else if (source === 'playlist') {
        await uploadPlaylistThumbnail(numericId, file)
      }
    },
    [numericId, source]
  )

  const updateTitle = useCallback(
    async (title: string) => {
      if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
        return

      if (source === 'request') {
        await updateRequestTitle(numericId, title)
      } else if (source === 'playlist') {
        await updatePlaylistTitle(numericId, title)
      }
    },
    [numericId, source]
  )

  const afterSave = useCallback(async () => {
    refreshPlaylists()
    await reload()
    setRefreshKey((k) => k + 1)
    closeModal()
  }, [refreshPlaylists, reload])

  const handleDeletePlaylist = async () => {
    if (isDeleting) return
    if (!isSource(source) || !Number.isInteger(numericId) || numericId <= 0)
      return
    if (!window.confirm('삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      if (source === 'playlist') {
        await deletePlaylist(numericId)
      } else if (source === 'request') {
        await deleteRequest(numericId)
      }
      refreshPlaylists()
      navigate('/')
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    reload()
  }, [reload])

  if (isLoading) return <div>Loading</div>
  if (!detail) return <div>Not found</div>
  return (
    <div>
      <img
        src={srcThumbnailUrl}
        alt=""
        className={styles.thumbnail}
        onClick={!isLoading ? openModal : undefined}
      />

      <h2
        className={styles.detailTitle}
        onClick={!isLoading ? openModal : undefined}
      >
        {detail?.title}
      </h2>

      <PlaylistEditModal
        isOpen={modalOpen}
        onClose={closeModal}
        fileInputRef={fileInputRef}
        uploadThumbnail={uploadThumbnail}
        updateTitle={updateTitle}
        preview={srcThumbnailUrl}
        title={detail.title}
        onSave={afterSave}
      />

      <button onClick={handleDeletePlaylist} disabled={isDeleting}>
        {isDeleting ? '삭제 중...' : '삭제하기'}
      </button>

      {tracks.map((track) => (
        <div key={track.trackId}>
          <h2>{track.name}</h2>
        </div>
      ))}
    </div>
  )
}
