import { useCallback, useEffect, useState } from 'react'
import styles from './PlaylistSide.module.css'
import { useNavigate } from 'react-router-dom'
import { addRequest, getRequests } from '../../features/request/api/RequestApi'
import PlaylistNRequestCreateModal from '../../shared/modals/PlaylistNRequestCreateModal'
import RequestPlaylistSide from './components/RequestPlaylistSide/RequestPlaylistSide'
import type { Request } from '../../types/request'
import {
  addPlaylist,
  getMyPlaylists,
} from '../../features/playlists/api/PlaylistApi'
import type { Playlist } from '../../types/playlist'
import MyPlaylistSide from './components/MyPlaylistSide/MyPlaylistSide'
import MenuModal from '../../shared/modals/MenuModal'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export type PlaylistSideProps = {
  playlistVersion: number
  refreshPlaylists: () => void
}
export const DEFAULT_THUMBNAIL = '/images/default-music-icon.png'

type Kind = 'playlist' | 'request'
type ModalKind = Kind | null

const OPTIONS: { optionName: string; kind: Kind }[] = [
  { optionName: '내 플레이리스트', kind: 'playlist' },
  { optionName: '추천 플레이리스트', kind: 'request' },
]

export default function PlaylistSide({
  playlistVersion,
  refreshPlaylists,
}: PlaylistSideProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [optionOpen, setOptionOpen] = useState(false)
  const [selectedKind, setSelectedKind] = useState<Kind>('playlist')
  const [activeModal, setActiveModal] = useState<ModalKind>(null)

  const navigate = useNavigate()

  const fetchRequests = useCallback(async () => {
    const res = await getRequests()
    const mapped: Request[] = (res.data as Request[]).map((r) => ({
      id: r.id,
      title: r.title,
      thumbnailUrl: r.thumbnailUrl ?? null,
    }))

    setRequests(mapped)
  }, [])

  const fetchPlaylists = useCallback(async () => {
    const res = await getMyPlaylists()
    const mapped: Playlist[] = (res.data as Playlist[]).map((p) => ({
      id: p.id,
      userName: p.userName,
      code: p.code,
      title: p.title,
      thumbnailUrl: p.thumbnailUrl ?? null,
      visibility: p.visibility,
    }))

    setPlaylists(mapped)
  }, [])

  useEffect(() => {
    const fetchLists = async () => {
      try {
        if (selectedKind === 'playlist') {
          await fetchPlaylists()
        } else {
          await fetchRequests()
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchLists()
  }, [selectedKind, fetchRequests, fetchPlaylists, playlistVersion])

  const handleSidebar = () => setSidebarOpen((s) => !s)

  const closeModal = () => setActiveModal(null)

  const addApi =
    activeModal === 'playlist'
      ? addPlaylist
      : activeModal === 'request'
        ? addRequest
        : null

  const handleCreated = async (newId: number) => {
    refreshPlaylists()
    closeModal()
    setSelectedKind(activeModal ?? 'playlist')
    navigate(`/detail/${activeModal ?? 'playlist'}/${newId}`)
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
              <p>{OPTIONS.find((o) => o.kind === selectedKind)!.optionName}</p>
            </div>
            {optionOpen && (
              <div className={styles.optionDropdown}>
                {OPTIONS.map((o) => (
                  <div
                    key={o.optionName}
                    className={styles.option}
                    onClick={() => {
                      setSelectedKind(o.kind)
                      setOptionOpen(false)
                    }}
                  >
                    {o.optionName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <MenuModal triggerName={sidebarOpen ? '+만들기' : '+'}>
            <DropdownMenu.Content
              className={styles.dropdownContent}
              side="bottom"
              align="end"
              sideOffset={19}
              collisionPadding={3}
              sticky="always"
            >
              <DropdownMenu.Item asChild>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => setActiveModal('playlist')}
                >
                  플레이리스트
                </button>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className={styles.dropdownSeparator} />

              <DropdownMenu.Item asChild>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => setActiveModal('request')}
                >
                  플리 요청
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </MenuModal>

          {addApi && (
            <PlaylistNRequestCreateModal
              isOpen={activeModal !== null}
              onClose={closeModal}
              onCreated={handleCreated}
              addApi={addApi}
            />
          )}
        </div>
        <div className={styles.playlistListWrapper}>
          {selectedKind === 'playlist' ? (
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
      </div>
    </>
  )
}
