import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { authService } from '../../../services/api'
import styles from './AuthForm.module.css'

export default function AuthPage({ isLogin = true }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = isLogin 
        ? await authService.login({ email: formData.email, password: formData.password })
        : await authService.register(formData)
      
      login(data) // Updates global context and localStorage
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              className={styles.input}
              type="text" 
              required 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
        )}
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input 
            className={styles.input}
            type="email" 
            required 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input 
            className={styles.input}
            type="password" 
            required 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
        </div>
        <button className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>
    </div>
  )
}