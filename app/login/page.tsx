'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail, signUpWithEmail } from '@/lib/auth'
import { createClient } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await signInWithEmail(email, password)
      if (error) { setMessage(error.message); setLoading(false) }
      else router.push('/dashboard')
    } else {
      const { error } = await signUpWithEmail(email, password)
      if (error) { setMessage(error.message); setLoading(false) }
      else router.push('/onboarding')
    }
  }

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://facetify-dysv.vercel.app/auth/callback`
      }
    })
    if (error) setMessage(error.message)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0907; font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .card { animation: fadeUp 0.5s ease both; }
        .input-field { width: 100%; padding: 14px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #f0ebe4; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(232,133,106,0.5); background: rgba(255,255,255,0.06); }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .submit-btn { width: 100%; padding: 15px; border-radius: 8px; border: none; background: #e8856a; color: white; font-family: 'DM Sans', sans-serif; font-size: 0.97rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .submit-btn:hover:not(:disabled) { background: #f0a088; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .google-btn { width: 100%; padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #f0ebe4; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .google-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .divider { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 0.75rem; color: rgba(255,255,255,0.25); font-weight: 500; }
        .tab-btn { flex: 1; padding: 10px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.88rem; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0907', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>

        {/* Background */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,133,106,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,191,140,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '0.06em', color: '#f0ebe4' }}>
              FACE<span style={{ color: '#e8856a' }}>TIFY</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
              {isLogin ? 'Connecte-toi à ton compte' : 'Crée ton compte gratuit'}
            </p>
          </div>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Google Button */}
            <button className="google-btn" onClick={handleGoogle}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continuer avec Google
            </button>

            {/* Divider */}
            <div className="divider" style={{ margin: '20px 0' }}>
              <div className="divider-line" />
              <span className="divider-text">ou</span>
              <div className="divider-line" />
            </div>

            {/* Tab toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {['Connexion', 'Inscription'].map((tab, i) => (
                <button key={i} className="tab-btn"
                  onClick={() => { setIsLogin(i === 0); setMessage('') }}
                  style={{ background: (i === 0) === isLogin ? 'rgba(255,255,255,0.08)' : 'transparent', color: (i === 0) === isLogin ? '#f0ebe4' : 'rgba(255,255,255,0.3)' }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Email</label>
                <input type="email" className="input-field" placeholder="ton@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mot de passe</label>
                <input type="password" className="input-field" placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
            </div>

            {/* Error */}
            {message && (
              <div style={{ background: 'rgba(232,133,106,0.08)', border: '1px solid rgba(232,133,106,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
                <p style={{ color: '#e8856a', fontSize: '0.82rem' }}>{message}</p>
              </div>
            )}

            {/* Submit */}
            <button className="submit-btn" onClick={handleSubmit} disabled={loading || !email || !password}>
              {loading ? 'Chargement...' : isLogin ? 'Se connecter →' : 'Créer mon compte →'}
            </button>

          </div>

          {/* Back */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem' }}>
            <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem' }}>
              ← Retour à l'accueil
            </button>
          </p>

        </div>
      </div>
    </>
  )
}