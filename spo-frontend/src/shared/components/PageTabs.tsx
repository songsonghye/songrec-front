import { NavLink } from 'react-router-dom'
import styles from './PageTabs.module.css'

export default function PageTabs() {
  return (
    <>
      <div className={styles.tabs}>
        <NavLink to="/" className={styles.tab}>
          모두
        </NavLink>

        <NavLink to="/" className={styles.tab}>
          플레이리스트
        </NavLink>

        <NavLink to="/community" className={styles.tab}>
          플리 요청함
        </NavLink>

        <NavLink to="/today" className={styles.tab}>
          오늘의 한 곡
        </NavLink>
      </div>

      <hr className={styles.divider} />
    </>
  )
}
