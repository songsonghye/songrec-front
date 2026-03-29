import { useEffect, useState } from "react";
import type { RequestFeedItem } from "../types/request";
import { addRequest, getAllRequests } from "../features/request/api/RequestApi";
import { DEFAULT_THUMBNAIL, resolveImageUrl } from "../utils/image";
import styles from "../features/community/components/CommunityHome/CommunityHome.module.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatFeedTime } from "../utils/time";
import PageTabs from "../shared/components/PageTabs";

export default function CommunityHome() {
  const { playlistVersion } = useOutletContext<{
    refreshPlaylists: () => void;
    playlistVersion: number;
  }>();

  const [requests, setRequests] = useState<RequestFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestPrompt, setRequestPrompt] = useState("");
  const [isSubmitted, setSubmit] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getAllRequests();
      const mapped: RequestFeedItem[] = (res.data as RequestFeedItem[]).map(
        (r) => ({
          id: r.id,
          username: r.username,
          title: r.title,
          thumbnailUrl: r.thumbnailUrl,
          keywords: r.keywords,
          trackCount: r.trackCount,
          createdAt: r.createdAt,
        }),
      );
      setRequests(mapped);
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeed = (id: number) => {
    navigate(`/detail/request/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitted) return;

    try {
      setSubmit(true);
      const res = await addRequest(requestPrompt);
      setRequestPrompt("");
      setRequestModalOpen(false);
      navigate(`/detail/request/${res.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmit(false);
    }
  };

  const handleCloseAddRequest = () => {
    setRequestModalOpen(false);
    setRequestPrompt("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.label}>Community</div>
            <h1 className={styles.heroTitle}>플리 요청함</h1>
            <p className={styles.heroDescription}>
              지금 올라온 요청들을 둘러보고, 어울리는 노래를 추천해보세요.
            </p>
          </div>
        </div>
      </section>

      <PageTabs />

      <section className={styles.feedSection}>
        {requestModalOpen ? (
          <div className={styles.addRequestPanel}>
            <div className={styles.addRequestPanelHeader}>
              <div className={styles.addRequestPanelTitle}>
                어떤 플레이리스트를 찾고 있나요?
              </div>
              <button
                type="button"
                className={styles.addRequestCloseBtn}
                onClick={handleCloseAddRequest}
              >
                ×
              </button>
            </div>
            <form className={styles.addRequestForm} onSubmit={handleSubmit}>
              <input
                className={styles.addRequestInput}
                type="text"
                name="text"
                value={requestPrompt}
                onChange={(e) => setRequestPrompt(e.target.value)}
                placeholder="예: 비 오는 날 밤에 듣기 좋은 잔잔한 플리 추천해주세요"
                required
              />
              <button
                type="submit"
                disabled={isSubmitted}
                style={{ display: "none" }}
              >
                추가
              </button>
            </form>
          </div>
        ) : (
          <button
            type="button"
            className={styles.addRequestOpenBtn}
            onClick={() => setRequestModalOpen((s) => !s)}
          >
            플리 요청하기
          </button>
        )}

        <div className={styles.feedHeader}>
          <div className={styles.feedHeaderText}>
            <h2 className={styles.feedTitle}>최근 요청</h2>
            <p className={styles.feedDescription}>
              사람들이 지금 찾고 있는 분위기와 상황들을 모아봤어요.
            </p>
          </div>

          <div className={styles.feedCount}>{requests.length} requests</div>
        </div>

        {isLoading ? (
          <div className={styles.empty}>요청 목록을 불러오는 중이에요.</div>
        ) : requests.length === 0 ? (
          <div className={styles.empty}>
            아직 등록된 요청이 없어요. 첫 번째 요청을 만들어보세요.
          </div>
        ) : (
          <div className={styles.feedList}>
            {requests.map((request) => {
              const srcThumbnailUrl = request.thumbnailUrl
                ? `${resolveImageUrl(request.thumbnailUrl)}?v=${playlistVersion}`
                : DEFAULT_THUMBNAIL;
              return (
                <article
                  key={request.id}
                  className={styles.card}
                  onClick={() => handleFeed(request.id)}
                >
                  <div className={styles.thumbnailWrap}>
                    <img
                      src={srcThumbnailUrl}
                      alt={request.title}
                      className={styles.thumbnail}
                    />
                  </div>

                  <div className={styles.content}>
                    <div className={styles.topRow}>
                      <div className={styles.title}>{request.title}</div>
                      <div className={styles.username}>@{request.username}</div>
                    </div>

                    <div className={styles.keywords}>
                      {request.keywords?.slice(0, 4).map((k) => (
                        <span key={k} className={styles.keyword}>
                          {k}
                        </span>
                      ))}
                    </div>

                    <div className={styles.meta}>
                      <span>{request.trackCount}곡</span>
                      <span>{formatFeedTime(request.createdAt)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
