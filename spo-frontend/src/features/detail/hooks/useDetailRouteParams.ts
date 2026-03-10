import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { Source } from '../../../page/PlaylistDetailPage'

type DetailRouteParams = {
  source: Source
  numericId: number
}
const isSource = (s: string | undefined): s is Source =>
  s === 'playlist' || s === 'request'

export function useDetailRouteParams(): DetailRouteParams | null {
  const { source, id } = useParams()

  return useMemo(() => {
    const numericId = Number(id)

    if (!isSource(source)) return null
    if (!Number.isInteger(numericId) || numericId <= 0) return null

    return {
      source,
      numericId,
    }
  }, [source, id])
}
