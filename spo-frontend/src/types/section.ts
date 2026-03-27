export interface SectionItem {
  id: number
  creator: string
  thumbnailUrl?: string | null
  title: string
}

export interface ProfileSectionItem {
  id: number
  name: string
  artist?: string
  creator?: string
  imageUrl?: string | null
}
