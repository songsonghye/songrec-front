import PlaylistSide from './pages/PlaylistSide/PlaylistSide'
import Header from './pages/Header/Header'
import FooterPlayer from './pages/FooterPlayer/FooterPlayer'
import styles from './Layout.module.css'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useState } from 'react'
function Layout() {
  const [playlistVersion, setPlaylistVersion] = useState(0)
  const refreshPlaylists = () => setPlaylistVersion((v) => v + 1)
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <Header />
        </div>

        <div className={styles.playlistSide}>
          <PlaylistSide
            playlistVersion={playlistVersion}
            refreshPlaylists={refreshPlaylists}
          />
        </div>

        <div className={styles.homePage}>
          <Outlet context={refreshPlaylists} />
        </div>

        <div className={styles.footerPlayer}>
          <FooterPlayer />
        </div>
      </div>
      <ScrollRestoration />
    </>
  )
}

export default Layout
