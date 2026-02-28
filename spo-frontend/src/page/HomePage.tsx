import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { Playlist } from '../types/playlist'
import {
  getMyPlaylists,
  getPublicPlaylists,
} from '../features/playlists/api/PlaylistApi'
import SectionCard from '../features/home/components/SectionCard/SectionCard'
import type { SectionItem } from '../types/section'
import { AuthOnly, GuestOnly } from '../shared/components/AuthVisibility'
import { useAuthStore } from '../shared/auth/authStore'

export default function HomePage() {
  const [publicPlaylists, setPublicPlaylists] = useState<SectionItem[]>([])
  const [myPlaylists, setMyPlaylists] = useState<SectionItem[]>([])
  const { playlistVersion } = useOutletContext<{
    refreshPlaylists: () => void
    playlistVersion: number
  }>()
  const first = useRef(true)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const authOnlySections = [
    {
      key: 'popular',
      title: '인기 플레이리스트',
      data: publicPlaylists,
    },
    {
      key: 'mine',
      title: '내 플레이리스트',
      data: myPlaylists,
    },
    {
      key: 'album',
      title: '인기 앨범 및 싱글',
      data: myPlaylists,
    },
    {
      key: 'artist',
      title: '인기 아티스트',
      data: myPlaylists,
    },
    {
      key: 'today',
      title: '오늘의 플리',
      data: myPlaylists,
    },
  ]

  const guestOnlySections = [
    {
      key: 'popular',
      title: '인기 플레이리스트',
      data: publicPlaylists,
    },
    {
      key: 'chart',
      title: '추천 차트',
      data: publicPlaylists,
    },
    {
      key: 'album',
      title: '인기 앨범 및 싱글',
      data: publicPlaylists,
    },
    {
      key: 'artist',
      title: '인기 아티스트',
      data: publicPlaylists,
    },
  ]

  const fetchPublicData = async () => {
    try {
      const pubRes = await getPublicPlaylists(0, 10)
      const pubMap: SectionItem[] = (pubRes.data.content as Playlist[]).map(
        (p) => ({
          id: p.id,
          creator: p.userName,
          thumbnailUrl: p.thumbnailUrl ?? null,
          title: p.title,
        })
      )

      setPublicPlaylists(pubMap)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchMyPlaylistData = async () => {
    try {
      const myRes = await getMyPlaylists()
      const myMap: SectionItem[] = (myRes.data as Playlist[]).map((p) => ({
        id: p.id,
        creator: p.userName,
        thumbnailUrl: p.thumbnailUrl ?? null,
        title: p.title,
      }))

      setMyPlaylists(myMap)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchPublicData()
    console.log('Home auth:', useAuthStore.getState())
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchMyPlaylistData()
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setMyPlaylists([])
      return
    }
    if (first.current) {
      first.current = false
      return
    }
    fetchMyPlaylistData()
  }, [playlistVersion, isAuthenticated])

  return (
    <div>
      <div>모두</div>
      <div>플레이리스트</div>
      <div>플리 요청함</div>
      <hr></hr>

      <AuthOnly>
        {authOnlySections.map((section) => (
          <div key={section.key}>
            <SectionCard
              sectionTitle={section.title}
              sectionItems={section.data}
              playlistVersion={playlistVersion}
            />
          </div>
        ))}
      </AuthOnly>
      <GuestOnly>
        {guestOnlySections.map((section) => (
          <div key={section.key}>
            <SectionCard
              sectionTitle={section.title}
              sectionItems={section.data}
              playlistVersion={playlistVersion}
            />
          </div>
        ))}
      </GuestOnly>
    </div>
  )
}
