'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const SKIN_TYPES = {
  oily: { label: 'Grasse', emoji: '💧', color: '#7bbf8c' },
  dry: { label: 'Sèche', emoji: '🏜️', color: '#c9a96e' },
  combination: { label: 'Mixte', emoji: '⚖️', color: '#e8856a' },
  sensitive: { label: 'Sensible', emoji: '🌸', color: '#b89dff' },
}

const ACNE_LEVELS = {
  mild: { label: 'Légère', emoji: '🟡', color: '#c9a96e' },
  moderate: { label: 'Modérée', emoji: '🟠', color: '#e8856a' },
  severe: { label: 'Sévère', emoji: '🔴', color: '#e85a5a' },
}

const ACHIEVEMENTS = [
  { emoji: '🌱', name: 'Premier pas', desc: 'Jour 1 complété', unlocked: true },
  { emoji: '💧', name: 'Hydraté(e)', desc: '3 jours de suite', unlocked: true },
  { emoji: '🔥', name: 'En feu', desc: '7 jours de streak', unlocked: true },
  { emoji: '⭐', name: 'Régulier(e)', desc: '10 jours complétés', unlocked: true },
  { emoji: '💎', name: 'Diamant', desc: '2 semaines de suite', unlocked: false },
  { emoji: '🏆', name: 'Champion(ne)', desc: '30 jours complétés', unlocked: false },
  { emoji: '🌟', name: 'Transformation', desc: 'Score +50 points', unlocked: false },
  { emoji: '👑', name: 'Légende', desc: '60 jours consécutifs', unlocked: false },
]

const FAQ_ITEMS = [
  { q: 'Comment modifier mon type de peau ?', a: 'Va dans Paramètres > Profil peau pour refaire le diagnostic complet.' },
  { q: 'Puis-je annuler mon abonnement ?', a: 'Oui, annulation en 1 clic depuis la section Abonnement ci-dessous. Aucuns frais cachés.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Toutes tes données sont chiffrées et ne sont jamais partagées avec des tiers.' },
  { q: 'Comment contacter le support ?', a: 'Écris-nous à support@facetify.com. Réponse sous 24h garantie.' },
]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [skinProfile, setSkinProfile] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<'profile' | 'subscription' | 'settings'>('profile')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [notifications, setNotifications] = useState({ morning: true, evening: true, tips: false, weekly: true })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)
      const { data } = await supabase.from('skin_profiles').select('*').eq('user_id', user.id).single()
      setSkinProfile(data)
    }
    load()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  const firstName = user?.email?.split('@')[0]?.replace(/[0-9]/g, '')
  const displayName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'Utilisateur'
  const skinType = skinProfile?.skin_type as keyof typeof SKIN_TYPES
  const acneLevel = skinProfile?.acne_level as keyof typeof ACNE_LEVELS

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2ed; font-family: 'DM Sans', sans-serif; color: #1a1714; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.1)} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .card { background: white; border-radius: 20px; padding: 20px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .tab-btn { flex: 1; padding: 11px 8px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-radius: 10px; transition: all 0.2s; color: #8c8278; }
        .tab-btn.active { background: white; color: #1a1714; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .menu-item { display: flex; align-items: center; gap: 14px; padding: 15px 0; border-bottom: 1px solid rgba(0,0,0,0.05); cursor: pointer; transition: opacity 0.2s; }
        .menu-item:last-child { border-bottom: none; }
        .menu-item:hover { opacity: 0.7; }
        .menu-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .badge-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .badge-emoji-wrap { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 2px solid rgba(0,0,0,0.06); transition: all 0.3s; }
        .badge-item.unlocked .badge-emoji-wrap { background: linear-gradient(135deg, #fff8f0, #fff); border-color: #c9a96e; box-shadow: 0 4px 16px rgba(201,169,110,0.25); }
        .badge-item.locked { opacity: 0.3; }
        .toggle { width: 44px; height: 24px; border-radius: 12px; background: #e8e4df; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
        .toggle.on { background: #7bbf8c; }
        .toggle-dot { width: 20px; height: 20px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.15); }
        .toggle.on .toggle-dot { transform: translateX(20px); }
        .faq-item { border-bottom: 1px solid rgba(0,0,0,0.05); }
        .faq-item:last-child { border-bottom: none; }
        .faq-btn { width: 100%; background: none; border: none; padding: 14px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; color: #1a1714; text-align: left; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-item.open .faq-answer { max-height: 100px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: white; border-top: 1px solid rgba(0,0,0,0.06); display: flex; z-index: 50; padding: 8px 0 16px; box-shadow: 0 -8px 32px rgba(0,0,0,0.06); }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 600; color: #c4b5a5; cursor: pointer; padding: 6px; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.04em; }
        .nav-item.active { color: #e8856a; }
        .nav-icon { font-size: 1.2rem; }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#f5f2ed', minHeight: '100vh', paddingBottom: '100px' }}>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(180deg, #1a1714, #2d2420)', padding: '20px 20px 28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(232,133,106,0.07)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(123,191,140,0.05)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans' }}>←</button>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>Mon Profil</h1>
          </div>

          {/* Avatar card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8856a, #c9a96e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
              {displayName.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 600, color: 'white', letterSpacing: '-0.02em', marginBottom: '3px' }}>{displayName}</h2>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#e8856a', background: 'rgba(232,133,106,0.15)', border: '1px solid rgba(232,133,106,0.25)', padding: '3px 10px', borderRadius: '50px' }}>Jour 18/30</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#7bbf8c', background: 'rgba(123,191,140,0.15)', border: '1px solid rgba(123,191,140,0.25)', padding: '3px 10px', borderRadius: '50px' }}>🔥 12 jours streak</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>

          {/* TABS */}
          <div style={{ margin: '16px 0 14px', background: '#ede9e2', borderRadius: '14px', padding: '4px', display: 'flex' }}>
            {[
              { id: 'profile', label: '👤 Profil' },
              { id: 'subscription', label: '💳 Abonnement' },
              { id: 'settings', label: '⚙️ Réglages' },
            ].map(tab => (
              <button key={tab.id} className={`tab-btn ${activeSection === tab.id ? 'active' : ''}`}
                onClick={() => setActiveSection(tab.id as any)}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══ PROFILE TAB ══ */}
          {activeSection === 'profile' && (
            <div className="fade-up">

              {/* Skin profile */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Profil peau</p>
              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: '#f5f2ed', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{skinType ? SKIN_TYPES[skinType]?.emoji : '💧'}</p>
                    <p style={{ fontSize: '0.68rem', color: '#8c8278', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Type de peau</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1714' }}>{skinType ? SKIN_TYPES[skinType]?.label : 'Non défini'}</p>
                  </div>
                  <div style={{ background: '#f5f2ed', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{acneLevel ? ACNE_LEVELS[acneLevel]?.emoji : '🟡'}</p>
                    <p style={{ fontSize: '0.68rem', color: '#8c8278', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Niveau d'acné</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1714' }}>{acneLevel ? ACNE_LEVELS[acneLevel]?.label : 'Non défini'}</p>
                  </div>
                </div>
                <button onClick={() => router.push('/onboarding')} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', color: '#1a1714', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  🔄 Refaire le diagnostic →
                </button>
              </div>

              {/* Stats */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Mes statistiques</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                {[
                  { label: 'Jours actifs', value: '18', icon: '📅' },
                  { label: 'Streak max', value: '12', icon: '🔥' },
                  { label: 'Skin Score', value: '78', icon: '✨' },
                  { label: 'Constance', value: '84%', icon: '🎯' },
                  { label: 'Badges', value: '4/8', icon: '🏆' },
                  { label: 'Progression', value: '+73%', icon: '📈' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '14px 10px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '1rem', marginBottom: '4px' }}>{s.icon}</p>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: '#1a1714', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: '0.6rem', color: '#8c8278', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Mes badges</p>
              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  {ACHIEVEMENTS.map((badge, i) => (
                    <div key={i} className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="badge-emoji-wrap" style={{ background: badge.unlocked ? 'linear-gradient(135deg, #fff8f0, #fff)' : '#f0ece4' }}>
                        {badge.emoji}
                      </div>
                      <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#1a1714', textAlign: 'center', lineHeight: 1.3 }}>{badge.name}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px', background: '#f5f2ed', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.78rem', color: '#8c8278' }}>4/8 badges débloqués · Encore 4 à découvrir</p>
                </div>
              </div>

            </div>
          )}

          {/* ══ SUBSCRIPTION TAB ══ */}
          {activeSection === 'subscription' && (
            <div className="fade-up">
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Mon abonnement</p>

              {/* Current plan */}
              <div style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)', borderRadius: '20px', padding: '20px', marginBottom: '14px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(232,133,106,0.2)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #e8856a, transparent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Plan actuel</p>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Facetify Premium</p>
                  </div>
                  <div style={{ background: 'rgba(123,191,140,0.15)', border: '1px solid rgba(123,191,140,0.3)', borderRadius: '50px', padding: '4px 12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7bbf8c' }}>● Actif</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>10€</span>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)' }}>/mois</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {['Accès complet 4 semaines de routine', 'Suivi photo + journal de peau', 'IA personnalisée + conseils quotidiens', 'Badges et gamification complète'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#7bbf8c', fontSize: '0.8rem' }}>✓</span>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Prochain prélèvement</span>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>15 mai 2024</span>
                </div>
              </div>

              {/* Billing history */}
              <div className="card">
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714', marginBottom: '14px' }}>Historique de facturation</p>
                {[
                  { date: '15 avr. 2024', amount: '10,00€', status: 'Payé' },
                  { date: '15 mar. 2024', amount: '10,00€', status: 'Payé' },
                ].map((bill, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1714' }}>Facetify Premium</p>
                      <p style={{ fontSize: '0.72rem', color: '#8c8278' }}>{bill.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1714' }}>{bill.amount}</p>
                      <span style={{ fontSize: '0.65rem', color: '#7bbf8c', fontWeight: 700, background: 'rgba(123,191,140,0.1)', padding: '2px 8px', borderRadius: '50px' }}>{bill.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel */}
              <div className="card" style={{ border: '1px solid rgba(232,133,106,0.15)', background: '#fff9f7' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '0.95rem', fontWeight: 600, color: '#1a1714', marginBottom: '8px' }}>Annuler l'abonnement</p>
                <p style={{ fontSize: '0.8rem', color: '#8c8278', lineHeight: 1.6, marginBottom: '14px' }}>Tu perdras l'accès à ta routine personnalisée, tes progrès et ton streak. Cette action est irréversible.</p>
                <button style={{ width: '100%', padding: '13px', borderRadius: '12px', border: '1px solid rgba(232,133,106,0.3)', background: 'transparent', color: '#e8856a', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Annuler mon abonnement
                </button>
              </div>

            </div>
          )}

          {/* ══ SETTINGS TAB ══ */}
          {activeSection === 'settings' && (
            <div className="fade-up">

              {/* Notifications */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Notifications</p>
              <div className="card">
                {[
                  { key: 'morning', label: 'Rappel routine matin', sub: '7h30 · Chaque jour', emoji: '☀️' },
                  { key: 'evening', label: 'Rappel routine soir', sub: '21h00 · Chaque jour', emoji: '🌙' },
                  { key: 'tips', label: 'Conseil IA du jour', sub: 'Vers 12h · Chaque jour', emoji: '💡' },
                  { key: 'weekly', label: 'Résumé hebdomadaire', sub: 'Chaque dimanche', emoji: '📊' },
                ].map((notif, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', background: '#f5f2ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{notif.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1714' }}>{notif.label}</p>
                      <p style={{ fontSize: '0.72rem', color: '#8c8278', marginTop: '1px' }}>{notif.sub}</p>
                    </div>
                    <div className={`toggle ${notifications[notif.key as keyof typeof notifications] ? 'on' : ''}`}
                      onClick={() => setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key as keyof typeof notifications] }))}>
                      <div className="toggle-dot" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Account */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Compte</p>
              <div className="card">
                {[
                  { icon: '✉️', label: 'Email', sub: user.email, bg: '#f0f7ff' },
                  { icon: '🔑', label: 'Changer le mot de passe', sub: 'Dernière modif. il y a 30 jours', bg: '#f5f2ed' },
                  { icon: '🗑️', label: 'Supprimer mon compte', sub: 'Action irréversible', bg: '#fff5f5', danger: true },
                ].map((item, i) => (
                  <div key={i} className="menu-item">
                    <div className="menu-icon" style={{ background: item.bg }}>
                      <span>{item.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: item.danger ? '#e85a5a' : '#1a1714' }}>{item.label}</p>
                      <p style={{ fontSize: '0.72rem', color: '#8c8278', marginTop: '1px' }}>{item.sub}</p>
                    </div>
                    <span style={{ color: '#c4b5a5' }}>›</span>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>FAQ</p>
              <div className="card">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                    <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      {item.q}
                      <span style={{ color: '#c4b5a5', fontSize: '0.8rem', transition: 'transform 0.25s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', display: 'block', flexShrink: 0 }}>▾</span>
                    </button>
                    <div className="faq-answer">
                      <p style={{ fontSize: '0.82rem', color: '#8c8278', lineHeight: 1.65, paddingBottom: '14px' }}>{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Logout */}
              <button onClick={handleSignOut} style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: '#1a1714', color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', marginBottom: '10px' }}>
                Se déconnecter
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#c4b5a5', marginBottom: '16px' }}>
                Facetify v1.0 · © 2024 · <a href="#" style={{ color: '#e8856a', textDecoration: 'none' }}>CGU</a> · <a href="#" style={{ color: '#e8856a', textDecoration: 'none' }}>Confidentialité</a>
              </p>

            </div>
          )}

        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          {[
            { icon: '🏠', label: 'Accueil', active: false, action: () => router.push('/dashboard') },
            { icon: '📋', label: 'Routine', active: false, action: () => router.push('/routine') },
            { icon: '📸', label: 'Progrès', active: false, action: () => router.push('/progress') },
            { icon: '👤', label: 'Profil', active: true, action: () => {} },
          ].map((item, i) => (
            <div key={i} className={`nav-item ${item.active ? 'active' : ''}`} onClick={item.action}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

      </div>
    </>
  )
}