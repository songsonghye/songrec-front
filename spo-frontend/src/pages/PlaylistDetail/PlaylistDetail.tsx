import { useCallback, useEffect, useRef, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import {
  getRequestDetails,
  getRequestTracks,
  uploadRequestThumbnail,
} from '../../API/users/RequestApi'
import type { RequestDetail } from '../../types/requestDetail'
import styles from './PlaylistDetail.module.css'
import ThumbnailUploadModal from '../../modals/ThumbnailUploadModal'
import { DEFAULT_THUMBNAIL } from '../PlaylistSide/PlaylistSide'
import type { Track } from '../../types/track'
import {
  getPlaylistDetails,
  getPlaylistTracks,
} from '../../API/users/PlaylistApi'
import type { Playlist } from '../../types/playlist'

export default function PlaylistDetail() {
  const { source, id } = useParams()
  const numericId = Number(id)
  const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null)
  const [playlistDetail, setPlaylistDetail] = useState<Playlist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { refreshPlaylists } = useOutletContext<{
    refreshPlaylists: () => void
  }>()

  const thumbnailUrl =
    source === 'request'
      ? requestDetail?.thumbnailUrl
      : playlistDetail?.thumbnailUrl

  const srcThumbnailUrl = thumbnailUrl
    ? `${import.meta.env.VITE_API_URL}${thumbnailUrl}?v=${refreshKey}`
    : DEFAULT_THUMBNAIL

  const openModal = () => {
    // playlist thumbnail 업로드가 아직 없으면 request일 때만 열리게 하는 게 안전
    if (source !== 'request') return

    setModalOpen(true)
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }
  const closeModal = () => setModalOpen(false)

  const uploadThumbnail = useCallback(
    async (file: File) => {
      if (!source || Number.isNaN(numericId)) return

      if (source === 'request') {
        await uploadRequestThumbnail(2, numericId, file)
      } else if (source === 'playlist') {
        // TODO: playlist API 생기면 교체
        // await uploadPlaylistThumbnail(2, numericId, file)
        return
      }

      refreshPlaylists()
      setRefreshKey((k) => k + 1)
      closeModal()
    },
    [numericId, source, refreshPlaylists]
  )

  useEffect(() => {
    if (!source || Number.isNaN(numericId)) return

    const fetchData = async () => {
      try {
        if (source === 'request') {
          const [reqRes, traRes] = await Promise.all([
            getRequestDetails(2, numericId),
            getRequestTracks(2, numericId),
          ])
          setRequestDetail(reqRes.data)
          setTracks(traRes.data)
        } else {
          const [plsRes, traRes] = await Promise.all([
            getPlaylistDetails(2, numericId),
            getPlaylistTracks(2, numericId),
          ])
          setPlaylistDetail(plsRes.data)
          setTracks(traRes.data)
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [numericId, source, refreshKey])

  //초기화
  useEffect(() => {
    setRequestDetail(null)
    setPlaylistDetail(null)
    setTracks([])
  }, [source, numericId])

  return (
    <div>
      <img
        src={srcThumbnailUrl}
        alt=""
        className={styles.thumbnail}
        onClick={openModal}
      />

      <ThumbnailUploadModal
        isOpen={modalOpen}
        onClose={closeModal}
        fileInputRef={fileInputRef}
        uploadThumbnail={uploadThumbnail}
        preview={srcThumbnailUrl}
      />
      <h2 className={styles.detailTitle}>
        {source === 'request' ? requestDetail?.title : playlistDetail?.title}
      </h2>

      {tracks.map((track) => (
        <div>
          <h2>{track.name}</h2>
        </div>
      ))}
    </div>
  )
}
