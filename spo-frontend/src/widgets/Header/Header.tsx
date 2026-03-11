import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { logout } from '../../features/auth/api/authApi'
import { AuthOnly, GuestOnly } from '../../shared/components/AuthVisibility'
import MenuModal from '../../shared/modals/MenuModal'
import { useState } from 'react'

export default function Header() {
  const [search, setSearch] = useState('')
  const [isSubmitted, setSubmit] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitted) return

    try {
      setSubmit(true)
      navigate(`/search/${search}`)
      setSearch('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmit(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }
  return (
    <div className={styles.navBar}>
      <NavLink to={`/`} className={styles.logo}>
        NoraeMoa
      </NavLink>
      <div className={styles.homeNsearch}>
        <NavLink to={`/`} className={styles.homeBtn}>
          HOME
        </NavLink>
        <form onSubmit={handleSubmit}>
          <input
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
      </div>

      <AuthOnly>
        <MenuModal triggerName="프로필" className={styles.profileBtn}>
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
