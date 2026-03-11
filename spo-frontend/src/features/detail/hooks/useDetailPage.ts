import { useCallback, useMemo, useState } from 'react'
import type { Detail } from '../../../page/PlaylistDetailPage'
import { createDetailSourceAdapter } from '../services/detailSourceAdapter'
import type { SpotifyTrack, Track } from '../../../types/track'

export function useDetailPage(
  source: 'playlist' | 'request' | null,
  id: number | null
) {
  const adapter = useMemo(() => {
    if (!source) return null
    console.log('id:: ', id)
    return createDetailSourceAdapter(source)
  }, [source, id])
  const [isLoading, setIsLoading] = useState(false)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [tracks, setTracks] = useState<Track | null>(null)
  console.log('id: ', id)

  const reload = useCallback(async () => {
    if (!adapter || !id) return
    setIsLoading(true)
    try {
      const [detailData, trackData] = await Promise.all([
        adapter.getDetail(id),
        adapter.getTracks(id),
      ])
      setDetail(detailData)
      setTracks(trackData)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [adapter, id])

  const saveThumbnail = useCallback(
    async (file: File) => {
      if (!adapter || !id) return
      await adapter.uploadThumbnail(id, file)
      await reload()
    },
    [adapter, id, reload]
  )

  const saveTitle = useCallback(
    async (title: string) => {
      if (!adapter || !id) return
      await adapter.updateTitle(id, title)
      await reload()
    },
    [adapter, id, reload]
  )

  const deleteTrack = useCallback(
    async (trackId: number) => {
      if (!adapter || !id) return
      await adapter.deleteTrack(id, trackId)
      await reload()
    },
    [adapter, id, reload]
  )

  const addTrack = useCallback(
    async (track: SpotifyTrack) => {
      if (!adapter || !id) return
      await adapter.addTrack(id, track)
      await reload()
    },
    [adapter, id, reload]
  )

  return {
    detail,
    tracks,
    isLoading,
    reload,
    saveThumbnail,
    saveTitle,
    deleteTrack,
    addTrack,
  }
}
