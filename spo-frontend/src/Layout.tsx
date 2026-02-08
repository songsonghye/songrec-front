import PlaylistSide from "./pages/PlaylistSide/PlaylistSide";
import Header from "./pages/Header/Header";
import FooterPlayer from "./pages/FooterPlayer/FooterPlayer";
import styles from "./Layout.module.css";
import { Outlet, ScrollRestoration } from "react-router-dom";
function Layout() {
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <Header />
        </div>

        <div className={styles.playlistSide}>
          <PlaylistSide />
        </div>

        <div className={styles.homePage}>
          <Outlet />
        </div>

        <div className={styles.footerPlayer}>
          <FooterPlayer />
        </div>
      </div>
      <ScrollRestoration />
    </>
  );
}

export default Layout;
