'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail, signUpWithEmail } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (isLogin) {
      const { error } = await signInWithEmail(email, password)
      if (error) {
        setMessage(error.message)
      } else {
        router.push('/dashboard')
      }
    } else {
      const { error } = await signUpWithEmail(email, password)
      if (error) {
        setMessage(error.message)
      } else {
        router.push('/onboarding')
      }
    }
  }

  return (
    <main style={{
      backgroundColor: '#0c0b09',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: 'white'
    }}>
      <div style={{
        background: '#141210',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Face<span style={{ color: '#e8856a' }}>tify</span>
        </h1>
        <p style={{ color: '#8a7e74', marginBottom: '32px' }}>
          {isLogin ? 'Connecte-toi à ton compte' : 'Crée ton compte gratuit'}
        </p>

        <input
          type="email"
          placeholder="Ton email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#0c0b09',
            color: 'white',
            fontSize: '1rem',
            marginBottom: '12px',
            boxSizing: 'border-box'
          }}
        />

        <input
          type="password"
          placeholder="Ton mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#0c0b09',
            color: 'white',
            fontSize: '1rem',
            marginBottom: '24px',
            boxSizing: 'border-box'
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: '#e8856a',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          {isLogin ? 'Se connecter →' : 'Créer mon compte →'}
        </button>

        {message && (
          <p style={{ color: '#e8856a', textAlign: 'center', fontSize: '0.9rem' }}>
            {message}
          </p>
        )}

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            textAlign: 'center',
            color: '#8a7e74',
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          {isLogin ? "Pas de compte ? Inscris-toi" : "Déjà un compte ? Connecte-toi"}
        </p>
      </div>
    </main>
  )
}