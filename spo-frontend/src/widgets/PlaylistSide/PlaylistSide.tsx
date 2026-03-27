import { useCallback, useEffect, useState } from 'react'
import styles from './PlaylistSide.module.css'
import { useNavigate } from 'react-router-dom'
import { getMyRequests } from '../../features/request/api/RequestApi'
import PlaylistCreateModal from '../../shared/modals/PlaylistCreateModal'
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
  sidebarCollapsed: boolean
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

type Kind = 'playlist' | 'request'
type ModalKind = Kind | null

const OPTIONS: { optionName: string; kind: Kind }[] = [
  { optionName: '내 플레이리스트', kind: 'playlist' },
  { optionName: '추천 플레이리스트', kind: 'request' },
]

export default function PlaylistSide({
  playlistVersion,
  refreshPlaylists,
  sidebarCollapsed,
  setSidebarCollapsed,
}: PlaylistSideProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  const [optionOpen, setOptionOpen] = useState(false)
  const [selectedKind, setSelectedKind] = useState<Kind>('playlist')
  const [activeModal, setActiveModal] = useState<ModalKind>(null)

  const navigate = useNavigate()

  const fetchRequests = useCallback(async () => {
    const res = await getMyRequests()
    const mapped: Request[] = (res.data as Request[]).map((r) => ({
      id: r.id,
      title: r.title,
      thumbnailUrl: r.thumbnailUrl ?? null,
    }))
    setRequests(mapped)
  }, [])

  const fetchPlaylists = useCallback(async () => {
    const res = await getMyPlaylists()
    console.log('플리', res)
    const mapped: Playlist[] = (res as Playlist[]).map((p) => ({
      id: p.id,
      userId: p.userId,
      username: p.username,
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

  const handleSidebar = () => setSidebarCollapsed((s) => !s)
  const closeModal = () => setActiveModal(null)

  const addApi = activeModal === 'playlist' ? addPlaylist : null

  const handleCreated = async (newId: number) => {
    refreshPlaylists()
    closeModal()
    setSelectedKind(activeModal ?? 'playlist')
    navigate(`/detail/${activeModal ?? 'playlist'}/${newId}`)
  }

  return (
    <>
      <div
        data-collapsed={sidebarCollapsed ? 'true' : 'false'}
        className={styles.playlistSideContainer}
      >
        <div className={styles.plsHeader}>
          <button
            type="button"
            className={styles.sideToggleBtn}
            onClick={handleSidebar}
            aria-label={sidebarCollapsed ? '사이드바 열기' : '사이드바 접기'}
            title={sidebarCollapsed ? '사이드바 열기' : '사이드바 접기'}
          >
            {sidebarCollapsed ? '≡' : '사이드바'}
          </button>

          {!sidebarCollapsed && (
            <div className={styles.optionWrapper}>
              <div
                className={styles.plsTitle}
                onClick={() => setOptionOpen((prev) => !prev)}
              >
                <p>
                  {OPTIONS.find((o) => o.kind === selectedKind)!.optionName}
                </p>
                <span className={styles.chevron}>{optionOpen ? '−' : '+'}</span>
              </div>

              {optionOpen && (
                <div className={styles.optionDropdown}>
                  {OPTIONS.map((o) => (
                    <div
                      key={o.optionName}
                      className={`${styles.option} ${
                        selectedKind === o.kind ? styles.optionActive : ''
                      }`}
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
          )}

          <MenuModal
            triggerName={!sidebarCollapsed ? '+ 만들기' : '+'}
            className={styles.createTrigger}
          >
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
            <PlaylistCreateModal
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
              sidebarOpen={!sidebarCollapsed}
              playlistVersion={playlistVersion}
            />
          ) : (
            <RequestPlaylistSide
              requests={requests}
              sidebarOpen={!sidebarCollapsed}
              playlistVersion={playlistVersion}
            />
          )}
        </div>
      </div>
    </>
  )
}
