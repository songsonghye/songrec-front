export interface DailyTrack {
  id: number
  userId: number
  trackId: number
  spotifyId: string
  name: string
  artist: string
  imageUrl: string
  selectedDate: string
  emotion?: string
}

export interface DailyTrackStreak {
  currentStreak: number
}

export interface YesterdayDailyTrack {
  id: number
  userId: number
  username: string
  trackId: number
  spotifyId: string
  name: string
  artist: string
  imageUrl: string
  selectedDate: string
  emotion?: string
}

export type DailyTrackEmotion =
  | 'NONE'
  | 'HAPPY'
  | 'CALM'
  | 'SAD'
  | 'ENERGETIC'
  | 'LATE_NIGHT'
  | 'FOCUSED'
  | 'ROMANTIC'

export type DailyTrackEmotionOption = {
  value: Exclude<DailyTrackEmotion, 'NONE'>
  label: string
  emoji: string
}
