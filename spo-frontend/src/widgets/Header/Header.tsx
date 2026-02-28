import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { logout } from '../../features/auth/api/authApi'
import { AuthOnly, GuestOnly } from '../../shared/components/AuthVisibility'
import MenuModal from '../../shared/modals/MenuModal'

export default function Header() {
  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }
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

      <AuthOnly>
        <MenuModal triggerName="프로필">
          <DropdownMenu.Content
            className={styles.dropdownContent}
            side="bottom"
            align="end"
            sideOffset={19}
            collisionPadding={3}
            sticky="always"
          >
            <DropdownMenu.Item asChild>
              <NavLink to="/profile" className={styles.menuItem}>
                프로필
              </NavLink>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className={styles.dropdownSeparator} />

            <DropdownMenu.Item asChild>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => handleLogout()}
              >
                로그아웃
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </MenuModal>
      </AuthOnly>
      <GuestOnly>
        <NavLink to={`/login`} className={styles.login}>
          로그인
        </NavLink>
      </GuestOnly>
    </div>
  )
}
