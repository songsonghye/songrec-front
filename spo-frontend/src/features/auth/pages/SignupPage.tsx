import { useState } from 'react'
import { login, signup } from '../api/authApi'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const [isSubmitted, setSubmit] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitted) return

    try {
      setSubmit(true)
      await signup(email, username, password)
      await login(email, password)
      setEmail('')
      setUsername('')
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
        <h1>Signup Page</h1>
        <form onSubmit={handleSubmit}>
          <label>email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>username</label>
          <input
            type="text"
            name="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
      </div>
    </div>
  )
}
