import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { searchTrack } from '../features/track/api/TrackApi'
import type { Artist } from '../types/search'
import styles from '../features/search/components/SearchPage.module.css'
import { getArtist } from '../features/search/api/ArtistApi'
import {
  addTrackToPlaylist,
  getMyPlaylists,
} from '../features/playlists/api/PlaylistApi'
import type { Track, TrackCreateRequestDto } from '../types/track'
import MenuModal from '../shared/modals/MenuModal'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { Playlist } from '../types/playlist'
import SearchItems from '../features/search/components/SearchItems'

export default function SearchPage() {
  const { id } = useParams()
  const [tracks, setTracks] = useState<Track | null>(null)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const navigate = useNavigate()

  const handleAddTrack = async (
    playlistId: number,
    dto: TrackCreateRequestDto
  ) => {
    try {
      console.log('click: ', dto)
      await addTrackToPlaylist(playlistId, dto)

      navigate(`/detail/playlist/${playlistId}`)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFetchPlaylists = async () => {
    try {
      const playlistsRes = await getMyPlaylists()
      console.log('playlistsRes.data', playlistsRes.data)
      setPlaylists(playlistsRes.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const fetchTracks = async () => {
      const tracksRes = await searchTrack(id ?? '')
      setTracks(tracksRes.data)
    }

    fetchTracks()
  }, [id])

  useEffect(() => {
    if (tracks?.tracks.length === 0) return
    const fetchArtist = async () => {
      const artistId = tracks?.tracks.at(0)?.artist?.artistId
      if (!artistId) return
      const artistRes = await getArtist(artistId)
      setArtist(artistRes.data)
    }
    fetchArtist()
  }, [tracks])

  useEffect(() => {
    handleFetchPlaylists()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.topSection}>
        <div className={styles.artistBlock}>
          <h2 className={styles.sectionTitle}>아티스트</h2>

          <div className={styles.artistCard}>
            <img
              src={artist?.images?.at(0)?.url}
              alt={artist?.name ?? 'artist'}
              className={styles.artistImage}
            />
            <div className={styles.artistName}>{artist?.name}</div>
          </div>
        </div>

        <div className={styles.trackBlock}>
          <h2 className={styles.sectionTitle}>곡</h2>
          <SearchItems onLikeBtn={true} tracks={tracks}>
            {(track) => (
              <MenuModal
                triggerName="+"
                className={styles.addBtn}
                key={track.trackId}
              >
                <DropdownMenu.Content
                  className={styles.dropdownContent}
                  side="bottom"
                  align="end"
                  sideOffset={19}
                  collisionPadding={3}
                  sticky="always"
                >
                  {playlists.map((p) => (
                    <>
                      <DropdownMenu.Item asChild key={p.id}>
                        <button
                          type="button"
                          className={styles.menuItem}
                          onClick={() =>
                            handleAddTrack(p.id, {
                              spotifyId: track.spotifyId,
                              name: track.name,
                              artist: track.artistName,
                              album: track.album,
                              imageUrl: track.imageUrl,
                              durationMs: track.durationMs,
                            })
                          }
                        >
                          {p.title}
                        </button>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator
                        className={styles.dropdownSeparator}
                      />
                    </>
                  ))}
                </DropdownMenu.Content>
              </MenuModal>
            )}
          </SearchItems>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <h2 className={styles.sectionTitle}>{artist?.name} 피처링</h2>

        <div className={styles.cardRow}>
          {tracks?.tracks.map((i) => (
            <div key={i.track.trackId} className={styles.playlistCard}>
              <img
                src={i.track.imageUrl}
                alt={i.track.name}
                className={styles.playlistImage}
              />
              <div className={styles.playlistTitle}>{i.track.name}</div>
              <div className={styles.playlistDesc}>{i.artist?.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
