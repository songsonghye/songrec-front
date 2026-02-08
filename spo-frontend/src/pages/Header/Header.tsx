import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={styles.navBar}>
      <NavLink to={`/`} className={styles.logo}>
        SPO
      </NavLink>
      <div className={styles.homeNsearch}>
        <NavLink to={`/`} className={styles.homeBtn}>
          HOME
        </NavLink>
        <div>search</div>
      </div>
      <div>프로필</div>
    </div>
  );
}
