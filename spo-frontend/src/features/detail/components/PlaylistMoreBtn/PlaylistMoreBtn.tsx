import { useState } from 'react'
import MenuModal from '../../../../shared/modals/MenuModal'
import styles from './PlaylistMoreBtn.module.css'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { Detail, Source } from '../../../../page/PlaylistDetailPage'
import {
  deletePlaylist,
  updatePlaylistVisibility,
} from '../../../playlists/api/PlaylistApi'
import { deleteRequest } from '../../../request/api/RequestApi'
import { useNavigate } from 'react-router-dom'

export default function PlaylistMoreBtn({
  isSource,
  source,
  numericId,
  refreshPlaylists,
  detail,
  reload,
}: {
  isSource: (s: string | undefined) => s is Source
  source: string | null
  numericId: number | null
  refreshPlaylists: () => void
  detail: Detail | null
  reload: () => Promise<void>
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const handleDeletePlaylist = async () => {
    if (isDeleting || !source || !numericId) return
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

  const handleVisibility = async () => {
    if (!detail || source !== 'playlist' || !numericId) return
    const newVisibility = detail.visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'
    try {
      await updatePlaylistVisibility(numericId, newVisibility)
      await reload()
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div className={styles.actions}>
      <MenuModal triggerName={'...'}>
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
              onClick={handleDeletePlaylist}
              disabled={isDeleting}
            >
              삭제하기
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={styles.dropdownSeparator} />

          {source === 'playlist' ? (
            <DropdownMenu.Item asChild>
              <button
                type="button"
                className={styles.menuItem}
                onClick={handleVisibility}
              >
                {detail?.visibility === 'PRIVATE'
                  ? '공개로 설정'
                  : '비공개로 설정'}
              </button>
            </DropdownMenu.Item>
          ) : null}
        </DropdownMenu.Content>
      </MenuModal>
    </div>
  )
}
