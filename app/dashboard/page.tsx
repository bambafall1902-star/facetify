'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <main style={{
      backgroundColor: '#0c0b09',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      color: 'white',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '1.5rem' }}>
          Face<span style={{ color: '#e8856a' }}>tify</span>
        </h1>
        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#8a7e74',
            padding: '8px 20px',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Déconnexion
        </button>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#8a7e74', marginBottom: '4px' }}>Bonjour 👋</p>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{user.email}</h2>
      </div>

      {/* Streak Card */}
      <div style={{
        background: '#141210',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#8a7e74', fontSize: '0.85rem', marginBottom: '8px' }}>TON STREAK</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '2.5rem' }}>🔥</span>
          <div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0 jours</p>
            <p style={{ color: '#8a7e74', fontSize: '0.85rem' }}>Commence ta routine aujourd'hui !</p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div style={{
        background: '#141210',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#8a7e74', fontSize: '0.85rem', marginBottom: '8px' }}>PROGRESSION</p>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Jour 0 / 30</p>
        <div style={{
          height: '8px',
          background: '#1c1916',
          borderRadius: '4px'
        }}>
          <div style={{
            height: '100%',
            width: '0%',
            background: '#e8856a',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      {/* Start Routine Button */}
      <button
  onClick={() => router.push('/routine')}
  style={{
    width: '100%',
    padding: '18px',
    borderRadius: '16px',
    border: 'none',
    background: '#e8856a',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px'
  }}
>
  Voir ma routine →
</button>

<button
  onClick={async () => {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      console.log('Stripe response:', data)
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur: ' + JSON.stringify(data))
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }}
  style={{
    width: '100%',
    padding: '18px',
    borderRadius: '16px',
    border: '1px solid rgba(232,133,106,0.3)',
    background: '#141210',
    color: '#e8856a',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '12px'
  }}
>
  💳 Commencer l'essai gratuit 7 jours →
</button>
    </main>
  )
}