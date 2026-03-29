import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import styles from "../features/detail/components/PlaylistDetail.module.css";
import PlaylistEditModal from "../shared/modals/PlaylistEditModal";
import type { Visibility } from "../types/playlist";
import { useAuthStore } from "../shared/auth/authStore";
import { DEFAULT_THUMBNAIL, resolveImageUrl } from "../utils/image";
import PlaylistMoreBtn from "../features/detail/components/PlaylistMoreBtn/PlaylistMoreBtn";
import DetailHero from "../features/detail/components/DetailHero/DetailHero";
import { useDetailPage } from "../features/detail/hooks/useDetailPage";
import { useTrackSearch } from "../features/search/hooks/useTrackSearch";
import DetailTrackSection from "../features/detail/components/DetailTrackSection/DetailTrackSection";
import DetailSearchPanel from "../features/detail/components/DetailSearchPanel/DetailSearchPanel";
import PageTabs from "../shared/components/PageTabs";

export type Source = "playlist" | "request";
export type Detail = {
  userId: number;
  username: string;
  title: string;
  thumbnailUrl: string | null;
  visibility: Visibility;
  liked?: boolean;
};
const isSource = (s: string | undefined): s is Source =>
  s === "playlist" || s === "request";

export default function PlaylistDetailPage() {
  const { source, id } = useParams();

  const validSource =
    source === "playlist" || source === "request" ? source : null;
  const parsedId = Number(id);
  const validId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  const { refreshPlaylists } = useOutletContext<{
    refreshPlaylists: () => void;
    playlistVersion: number;
  }>();
  const userId = useAuthStore((s) => s.userId);
  const [modalOpen, setModalOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    searchTracks,
    searchModalOpen,
    search,
    isSubmitted,
    setSearch,
    handleSubmit,
    handleCloseSearch,
    setSearchModalOpen,
  } = useTrackSearch();

  const {
    detail,
    tracks,
    isLoading,
    reload,
    saveThumbnail,
    saveTitle,
    deleteTrack,
    addTrack,
  } = useDetailPage(validSource, validId);

  const isOwner = userId !== null && detail?.userId === userId;

  const thumbnailUrl = detail?.thumbnailUrl;

  const srcThumbnailUrl = thumbnailUrl
    ? `${resolveImageUrl(thumbnailUrl)}?v=${refreshKey}`
    : DEFAULT_THUMBNAIL;
  console.log("섬네일", srcThumbnailUrl);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const afterSave = useCallback(async () => {
    refreshPlaylists();
    await reload();
    setRefreshKey((k) => k + 1);
    closeModal();
  }, [refreshPlaylists, reload]);

  useEffect(() => {
    handleCloseSearch();
  }, [validId, validSource]);
  useEffect(() => {
    reload();
  }, [reload]);

  if (isLoading) return <div>Loading</div>;
  if (!detail) return <div>Not found</div>;
  return (
    <div className={styles.page}>
      <div className={styles.tabsWrap}>
        <PageTabs />
      </div>
      <DetailHero
        playlistId={validId}
        srcThumbnailUrl={srcThumbnailUrl}
        onEditClick={!isLoading && isOwner ? openModal : undefined}
        isOwner={isOwner}
        source={validSource}
        detail={detail}
        trackCount={tracks?.tracks?.length ?? 0}
        moreSlot={
          isOwner ? (
            <PlaylistMoreBtn
              isSource={isSource}
              source={validSource}
              numericId={validId}
              refreshPlaylists={refreshPlaylists}
              detail={detail}
              reload={reload}
            />
          ) : null
        }
      />
      <DetailTrackSection
        source={validSource}
        isOwner={isOwner}
        tracks={tracks}
        deleteTrack={deleteTrack}
      />

      <DetailSearchPanel
        id={validId}
        searchTracks={searchTracks}
        searchModalOpen={searchModalOpen}
        handleCloseSearch={handleCloseSearch}
        handleSubmit={handleSubmit}
        search={search}
        setSearch={setSearch}
        isSubmitted={isSubmitted}
        setSearchModalOpen={setSearchModalOpen}
        addTrack={addTrack}
      />
      <PlaylistEditModal
        isOpen={modalOpen}
        onClose={closeModal}
        fileInputRef={fileInputRef}
        uploadThumbnail={saveThumbnail}
        updateTitle={saveTitle}
        preview={srcThumbnailUrl}
        title={detail.title}
        onSave={afterSave}
      />
    </div>
  );
}
