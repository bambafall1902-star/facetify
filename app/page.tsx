'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  return (
    <main style={{
      backgroundColor: '#0c0b09',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        Face<span style={{ color: '#e8856a' }}>tify</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#8a7e74', maxWidth: '500px', marginBottom: '40px' }}>
        Débarrasse-toi de ton acné en 30 jours grâce à une routine personnalisée
      </p>
      <button
        onClick={() => router.push('/login')}
        style={{
          backgroundColor: '#e8856a',
          color: 'white',
          padding: '16px 40px',
          borderRadius: '50px',
          border: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Commencer gratuitement →
      </button>
    </main>
  )
}