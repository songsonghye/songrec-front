import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './PlaylistSide.module.css'
import { useNavigate } from 'react-router-dom'
import { getRequests } from '../../API/users/RequestApi'
import PlaylistCreateModal from '../../modals/PlaylistCreateModal'
import RequestPlaylistSide from './components/RequestPlaylistSide/RequestPlaylistSide'
import type { Request } from '../../types/request'
import { getPlaylists } from '../../API/users/PlaylistApi'
import type { Playlist } from '../../types/playlist'
import MyPlaylistSide from './components/MyPlaylistSide/MyPlaylistSide'

export type PlaylistSideProps = {
  playlistVersion: number
  refreshPlaylists: () => void
}
export const DEFAULT_THUMBNAIL = '/images/default-music-icon.png'
export default function PlaylistSide({
  playlistVersion,
  refreshPlaylists,
}: PlaylistSideProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('내 플레이리스트')
  const [optionOpen, setOptionOpen] = useState(false)
  const options = ['내 플레이리스트', '추천 플레이리스트']
  const navigate = useNavigate()
  const requestsLoaded = useRef(false)
  const playlistsLoaded = useRef(false)

  const fetchRequests = useCallback(async () => {
    const res = await getRequests(2)
    const mapped: Request[] = (res.data as Request[]).map((r) => ({
      id: r.id,
      title: r.title,
      thumbnailUrl: r.thumbnailUrl ?? null,
    }))

    setRequests(mapped)
    requestsLoaded.current = true
  }, [])

  const fetchPlaylists = useCallback(async () => {
    const res = await getPlaylists(2)
    const mapped: Playlist[] = (res.data as Playlist[]).map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      thumbnailUrl: p.thumbnailUrl ?? null,
    }))

    setPlaylists(mapped)
    playlistsLoaded.current = true
  }, [])

  useEffect(() => {
    const fetchLists = async () => {
      try {
        if (selectedOption === '내 플레이리스트') {
          if (!playlistsLoaded.current) await fetchPlaylists()
        } else {
          if (!requestsLoaded.current) await fetchRequests()
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchLists()
  }, [selectedOption, fetchRequests, fetchPlaylists, playlistVersion])

  useEffect(() => {
    requestsLoaded.current = false
    playlistsLoaded.current = false
  }, [playlistVersion])

  const handleSidebar = () => setSidebarOpen((s) => !s)
  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  // TODO: 생성을 어디다 할지 정하기
  const handleCreated = async (newId: number) => {
    refreshPlaylists()
    closeModal()
    navigate(`/detail/request/${newId}`)
  }

  return (
    <>
      <div
        data-collapsed={sidebarOpen ? 'false' : 'true'}
        className={styles.playlistSideContainer}
      >
        <div className={styles.plsHeader}>
          <button onClick={handleSidebar}>사이드바</button>

          <div className={styles.optionWrapper}>
            <div
              className={styles.plsTitle}
              onClick={() => setOptionOpen((prv) => !prv)}
            >
              <p>{selectedOption}</p>
            </div>
            {optionOpen && (
              <div className={styles.optionDropdown}>
                {options.map((o) => (
                  <div
                    key={o}
                    className={styles.option}
                    onClick={() => {
                      setSelectedOption(o)
                      setOptionOpen(false)
                    }}
                  >
                    {o}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="button" onClick={openModal}>
            {sidebarOpen ? '+만들기' : '+'}
          </button>

          <PlaylistCreateModal
            isOpen={modalOpen}
            onClose={closeModal}
            onCreated={handleCreated}
          />
        </div>

        {selectedOption === '내 플레이리스트' ? (
          <MyPlaylistSide
            playlists={playlists}
            sidebarOpen={sidebarOpen}
            playlistVersion={playlistVersion}
          />
        ) : (
          <RequestPlaylistSide
            requests={requests}
            sidebarOpen={sidebarOpen}
            playlistVersion={playlistVersion}
          />
        )}
      </div>
    </>
  )
}
