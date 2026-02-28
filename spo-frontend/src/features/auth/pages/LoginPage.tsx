import { useState } from 'react'
import { login } from '../api/authApi'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [isSubmitted, setSubmit] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitted) return

    try {
      setSubmit(true)
      await login(email, password)
      setEmail('')
      setPassword('')
      navigate(`/`)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmit(false)
    }
  }

  return (
    <div>
      <div>
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit}>
          <label>email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitted}>
            {isSubmitted ? 'loading...' : 'submit'}
          </button>
        </form>
        <NavLink to={`/signup`} className={styles.signup}>
          회원가입
        </NavLink>
      </div>
    </div>
  )
}
