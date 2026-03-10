import type { Item, Search } from '../../../../types/search'
import SearchItems from '../../../search/components/SearchItems'
import styles from './DetailSearchPanel.module.css'

interface DetailSearchPanelProps {
  id: number | null
  searchTracks: Search | null
  searchModalOpen: boolean
  handleCloseSearch: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  isSubmitted: boolean
  setSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  addTrack: (track: Item) => Promise<void>
}

export default function DetailSearchPanel({
  id,
  searchTracks,
  searchModalOpen,
  handleCloseSearch,
  handleSubmit,
  search,
  setSearch,
  isSubmitted,
  setSearchModalOpen,
  addTrack,
}: DetailSearchPanelProps) {
  return (
    <div className={styles.bottom}>
      {searchModalOpen ? (
        <div className={styles.searchPanel}>
          <div className={styles.searchPanelHeader}>
            <div className={styles.searchPanelTitle}>검색창</div>
            <button
              type="button"
              className={styles.searchCloseBtn}
              onClick={handleCloseSearch}
            >
              ×
            </button>
          </div>
          <form className={styles.searchForm} onSubmit={handleSubmit}>
            <input
              className={styles.searchInput}
              type="text"
              name="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="어떤 노래를 듣고 싶으세요?"
              required
            />
            <button
              type="submit"
              disabled={isSubmitted}
              style={{ display: 'none' }}
            >
              검색
            </button>
          </form>

          <SearchItems
            id={id}
            tracks={searchTracks}
            addTrack={addTrack}
          ></SearchItems>
        </div>
      ) : (
        <button
          type="button"
          className={styles.searchOpenBtn}
          onClick={() => setSearchModalOpen((s) => !s)}
        >
          더 찾아보기
        </button>
      )}
    </div>
  )
}
