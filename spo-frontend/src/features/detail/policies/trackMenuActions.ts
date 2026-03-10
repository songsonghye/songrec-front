export type TrackMenuAction = {
  key: string
  label: string
  onSelect: () => void
}

type TrackMenuContext = {
  source: string | null
  isOwner: boolean
  trackId: number
  onDeleteTrack: (trackId: number) => Promise<void>
}
export function getTrackMenuActions({
  source,
  isOwner,
  trackId,
  onDeleteTrack,
}: TrackMenuContext): TrackMenuAction[] {
  if (source === 'playlist') {
    return isOwner
      ? [
          {
            key: 'remove',
            label: '플레이리스트에서 제거',
            onSelect: () => onDeleteTrack(trackId),
          },
        ]
      : []
  }
  if (source === 'request') {
    const actions: TrackMenuAction[] = []
    if (isOwner) {
      actions.push({
        key: 'remove',
        label: '요청에서 제거',
        onSelect: () => onDeleteTrack(trackId),
      })
    }

    actions.push({
      key: 'rate',
      label: '별점 주기',
      onSelect: () => {
        console.log('별점 주기')
      },
    })
    return actions
  }
  return []
}
