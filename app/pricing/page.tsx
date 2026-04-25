'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0907; font-family: 'DM Sans', sans-serif; color: white; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .a1{animation:fadeUp 0.6s 0.1s ease both;}
        .a2{animation:fadeUp 0.6s 0.2s ease both;}
        .a3{animation:fadeUp 0.6s 0.3s ease both;}
        .a4{animation:fadeUp 0.6s 0.4s ease both;}
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0907', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>

        {/* Background */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,133,106,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div className="a1" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: '40px' }}>
          Face<span style={{ color: '#e8856a' }}>tify</span>
        </div>

        {/* Card */}
        <div className="a2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,133,106,0.2)', borderRadius: '28px', padding: 'clamp(32px,5vw,52px)', width: '100%', maxWidth: '480px', position: 'relative', overflow: 'hidden' }}>

          {/* Top line */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '1px', background: 'linear-gradient(to right, transparent, #e8856a, transparent)' }} />

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(232,133,106,0.1)', border: '1px solid rgba(232,133,106,0.2)', borderRadius: '50px', padding: '6px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#e8856a', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px' }}>
            ⚡ Accès complet
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.8rem,5vw,2.8rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Ta peau mérite<br /><span style={{ color: '#e8856a', fontStyle: 'italic' }}>mieux que ça</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '32px' }}>
            Débloque ta routine personnalisée, ton suivi de progrès et ton programme 30 jours complet.
          </p>

          {/* Price */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '5rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em' }}>
              <sup style={{ fontSize: '2rem', verticalAlign: 'top', marginTop: '14px' }}>€</sup>10
              <span style={{ fontSize: '1.1rem', fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>/mois</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#7bbf8c', fontWeight: 600, marginTop: '8px' }}>
              Résiliable à tout moment · 1 clic
            </p>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {[
              'Routine matin + soir personnalisée',
              'Programme 30 jours complet (4 semaines)',
              'Suivi photo + journal de peau',
              'Streaks, badges et gamification',
              'Conseils IA quotidiens',
              'Rappels personnalisables',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(123,191,140,0.12)', border: '1px solid rgba(123,191,140,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7bbf8c', fontSize: '0.72rem', flexShrink: 0, fontWeight: 700 }}>✓</div>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={handleSubscribe} disabled={loading}
            style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: '#e8856a', color: 'white', fontFamily: 'DM Sans', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 8px 32px rgba(232,133,106,0.35)', marginBottom: '14px' }}>
            {loading ? 'Chargement...' : 'S\'abonner maintenant — 10€/mois →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)' }}>
            🔒 Paiement sécurisé par Stripe · Annulation en 1 clic
          </p>
        </div>

        {/* Back */}
        <button onClick={() => router.push('/')} className="a4"
          style={{ marginTop: '24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.82rem' }}>
          ← Retour à l'accueil
        </button>

      </div>
    </>
  )
}