import { useState } from 'react'
import { searchTrack } from '../../track/api/TrackApi'
import type { Track } from '../../../types/track'

export function useTrackSearch() {
  const [searchTracks, setSearchTracks] = useState<Track | null>(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isSubmitted, setSubmit] = useState(false)

  const fetchTracks = async (keyword: string) => {
    const tracksRes = await searchTrack(keyword)
    console.log('tracks: ', tracksRes.data)
    setSearchTracks(tracksRes.data)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitted) return

    try {
      setSubmit(true)
      await fetchTracks(search)
      setSearch('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmit(false)
    }
  }
  const handleCloseSearch = () => {
    setSearchModalOpen(false)
    setSearchTracks(null)
  }

  return {
    searchTracks,
    searchModalOpen,
    search,
    isSubmitted,
    setSearch,
    handleSubmit,
    handleCloseSearch,
    setSearchModalOpen,
  }
}
