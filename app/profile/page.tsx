'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const SKIN_TYPES: Record<string, { label: string; emoji: string; desc: string }> = {
  oily: { label: 'Grasse', emoji: '💧', desc: 'Pores dilatés, brillance' },
  dry: { label: 'Sèche', emoji: '🏜️', desc: 'Tiraillements, écailles' },
  combination: { label: 'Mixte', emoji: '⚖️', desc: 'Zone T grasse, joues normales' },
  sensitive: { label: 'Sensible', emoji: '🌸', desc: 'Rougeurs, irritations' },
}

const ACNE_LEVELS: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
  mild: { label: 'Légère', emoji: '🟡', desc: 'Quelques boutons occasionnels', color: '#c9a96e' },
  moderate: { label: 'Modérée', emoji: '🟠', desc: 'Boutons réguliers', color: '#e8856a' },
  severe: { label: 'Sévère', emoji: '🔴', desc: 'Beaucoup de boutons', color: '#e85a5a' },
}

const ACHIEVEMENTS = [
  { emoji: '🌱', name: 'Premier pas', req: 1, color: '#7bbf8c' },
  { emoji: '💧', name: 'Hydraté(e)', req: 3, color: '#7bbf8c' },
  { emoji: '🔥', name: 'En feu', req: 7, color: '#e8856a' },
  { emoji: '⭐', name: 'Régulier(e)', req: 10, color: '#c9a96e' },
  { emoji: '💎', name: 'Diamant', req: 14, color: '#b89dff' },
  { emoji: '🏆', name: 'Champion(ne)', req: 21, color: '#c9a96e' },
  { emoji: '🌟', name: 'Transformation', req: 30, color: '#e8c87a' },
  { emoji: '👑', name: 'Légende', req: 60, color: '#e8856a' },
]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [skinProfile, setSkinProfile] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'settings'>('profile')
  const [notifications, setNotifications] = useState({ morning: true, evening: true, tips: false, weekly: true })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      const [{ data: skin }, { data: progress }, { data: prof }] = await Promise.all([
        supabase.from('skin_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('user_progress').select('*').eq('user_id', user.id).single(),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ])

      setSkinProfile(skin)
      setUserProgress(progress)
      setProfile(prof)
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf9', fontFamily: 'DM Sans, sans-serif', color: '#9b9189' }}>
      Chargement...
    </div>
  )

  const firstName = user?.email?.split('@')[0]?.replace(/[0-9]/g, '')
  const displayName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'Utilisateur'
  const skinType = skinProfile?.skin_type as string
  const acneLevel = skinProfile?.acne_level as string
  const dayNumber = userProgress?.day_number ?? 1
  const streak = userProgress?.streak_count ?? 0
  const skinScore = userProgress?.skin_score ?? 45
  const unlockedBadges = ACHIEVEMENTS.filter(b => streak >= b.req).length
  const programStart = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Aujourd\'hui'
return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fafaf9; font-family: 'DM Sans', sans-serif; color: #1a1714; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease both; }

        .section { padding: 32px 24px; border-bottom: 1px solid #f0ede8; }
        .section:last-child { border-bottom: none; }
        .section-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #c4b5a5; margin-bottom: 4px; }
        .section-title { font-family: 'Fraunces, serif'; font-size: 1.3rem; font-weight: 700; color: #1a1714; letter-spacing: -0.02em; margin-bottom: 4px; }
        .section-sub { font-size: 0.82rem; color: #9b9189; line-height: 1.6; }

        .notion-block { border-radius: 12px; border: 1px solid #f0ede8; background: white; overflow: hidden; }
        .notion-row { display: flex; align-items: center; padding: 14px 18px; border-bottom: 1px solid #f7f5f2; cursor: pointer; transition: background 0.15s; gap: 14px; }
        .notion-row:last-child { border-bottom: none; }
        .notion-row:hover { background: #fafaf9; }
        .notion-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
        .notion-label { flex: 1; font-size: 0.88rem; font-weight: 600; color: #1a1714; }
        .notion-sub { font-size: 0.72rem; color: #9b9189; margin-top: 1px; }
        .notion-value { font-size: 0.8rem; color: #c4b5a5; font-weight: 500; }
        .notion-arrow { color: #d4cec7; font-size: 0.9rem; }

        .tab-btn { flex: 1; padding: 10px 8px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600; cursor: pointer; border-radius: 10px; transition: all 0.2s; color: #9b9189; }
        .tab-btn.active { background: white; color: #1a1714; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        .badge-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .badge-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; transition: all 0.2s; }
        .badge-name { font-size: 0.62rem; font-weight: 700; color: #1a1714; text-align: center; line-height: 1.3; }

        .toggle { width: 42px; height: 24px; border-radius: 12px; background: #e8e4df; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; border: none; }
        .toggle.on { background: #1a1714; }
        .toggle-dot { width: 18px; height: 18px; border-radius: 50%; background: white; position: absolute; top: 3px; left: 3px; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .toggle.on .toggle-dot { transform: translateX(18px); }

        .faq-item { border-bottom: 1px solid #f7f5f2; }
        .faq-item:last-child { border-bottom: none; }
        .faq-btn { width: 100%; background: none; border: none; padding: 14px 18px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; color: #1a1714; text-align: left; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-item.open .faq-answer { max-height: 120px; }

        .btn-primary { width: 100%; padding: 14px; border-radius: 12px; border: none; background: #1a1714; color: white; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #2d2420; transform: translateY(-1px); }
        .btn-ghost { width: 100%; padding: 13px; border-radius: 12px; border: 1px solid #e8e4df; background: transparent; color: #9b9189; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #c4b5a5; color: #1a1714; }
        .btn-danger { width: 100%; padding: 13px; border-radius: 12px; border: 1px solid rgba(232,90,90,0.2); background: rgba(232,90,90,0.04); color: #e85a5a; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.88rem; cursor: pointer; }

        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: white; border-top: 1px solid #f0ede8; display: flex; z-index: 50; padding: 8px 0 16px; }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 0.6rem; font-weight: 700; color: #c4b5a5; cursor: pointer; padding: 6px; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.06em; }
        .nav-item.active { color: #1a1714; }
        .nav-icon { font-size: 1.2rem; }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fafaf9', minHeight: '100vh', paddingBottom: '80px' }}>

        {/* HEADER */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0ede8', position: 'sticky', top: 0, background: 'rgba(250,250,249,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ width: '34px', height: '34px', border: '1px solid #e8e4df', borderRadius: '10px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#9b9189', flexShrink: 0, fontFamily: 'DM Sans' }}>←</button>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.62rem', color: '#c4b5a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Facetify</p>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: '#1a1714', letterSpacing: '-0.02em' }}>Mon Profil</h1>
          </div>
          <button onClick={handleSignOut} style={{ padding: '7px 14px', border: '1px solid #e8e4df', borderRadius: '50px', background: 'white', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.75rem', fontWeight: 600, color: '#9b9189' }}>
            Déconnexion
          </button>
        </div>

        {/* AVATAR SECTION */}
        <div className="section fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8856a, #c9a96e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '3px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', flexShrink: 0 }}>
              {displayName.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#1a1714', letterSpacing: '-0.02em', marginBottom: '3px' }}>{displayName}</h2>
              <p style={{ fontSize: '0.78rem', color: '#9b9189', marginBottom: '8px' }}>{user.email}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#e8856a', background: 'rgba(232,133,106,0.08)', border: '1px solid rgba(232,133,106,0.15)', padding: '3px 10px', borderRadius: '6px' }}>Jour {dayNumber}/30</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#c9a96e', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)', padding: '3px 10px', borderRadius: '6px' }}>🔥 {streak} streak</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#7bbf8c', background: 'rgba(123,191,140,0.08)', border: '1px solid rgba(123,191,140,0.15)', padding: '3px 10px', borderRadius: '6px' }}>Score {skinScore}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#c4b5a5', marginTop: '14px' }}>Membre depuis le {programStart}</p>
        </div>

        {/* TABS */}
        <div style={{ padding: '12px 24px', background: '#fafaf9', borderBottom: '1px solid #f0ede8', position: 'sticky', top: '73px', zIndex: 9 }}>
          <div style={{ background: '#f0ede8', borderRadius: '12px', padding: '4px', display: 'flex' }}>
            {[
              { id: 'profile', label: '👤 Profil' },
              { id: 'subscription', label: '💳 Abonnement' },
              { id: 'settings', label: '⚙️ Réglages' },
            ].map(tab => (
              <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as any)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ PROFILE TAB ══ */}
        {activeTab === 'profile' && (
          <div className="fade-up">

            {/* Skin profile */}
            <div className="section">
              <div className="section-label">Profil peau</div>
              <h2 className="section-title">Ton diagnostic</h2>
              <p className="section-sub">Basé sur ton onboarding initial.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', marginBottom: '14px' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #f0ede8', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{SKIN_TYPES[skinType]?.emoji ?? '💧'}</p>
                  <p style={{ fontSize: '0.65rem', color: '#c4b5a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Type de peau</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1714' }}>{SKIN_TYPES[skinType]?.label ?? '—'}</p>
                  <p style={{ fontSize: '0.72rem', color: '#9b9189', marginTop: '2px' }}>{SKIN_TYPES[skinType]?.desc ?? ''}</p>
                </div>
                <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #f0ede8', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{ACNE_LEVELS[acneLevel]?.emoji ?? '🟡'}</p>
                  <p style={{ fontSize: '0.65rem', color: '#c4b5a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Acné</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1714' }}>{ACNE_LEVELS[acneLevel]?.label ?? '—'}</p>
                  <p style={{ fontSize: '0.72rem', color: '#9b9189', marginTop: '2px' }}>{ACNE_LEVELS[acneLevel]?.desc ?? ''}</p>
                </div>
              </div>

              <button onClick={() => router.push('/onboarding')} className="btn-ghost">
                🔄 Refaire le diagnostic
              </button>
            </div>

            {/* Stats */}
            <div className="section">
              <div className="section-label">Statistiques</div>
              <h2 className="section-title">Tes chiffres réels</h2>

              <div className="notion-block" style={{ marginTop: '16px' }}>
                {[
                  { icon: '📅', bg: 'rgba(232,133,106,0.08)', label: 'Jours de programme', sub: `Sur 30 jours total`, value: `${dayNumber}` },
                  { icon: '🔥', bg: 'rgba(201,169,110,0.08)', label: 'Streak actuel', sub: 'Jours consécutifs', value: `${streak}` },
                  { icon: '✨', bg: 'rgba(123,191,140,0.08)', label: 'Skin Score', sub: 'Sur 100 points', value: `${skinScore}` },
                  { icon: '🏆', bg: 'rgba(184,157,255,0.08)', label: 'Badges débloqués', sub: `Sur ${ACHIEVEMENTS.length} total`, value: `${unlockedBadges}` },
                ].map((s, i) => (
                  <div key={i} className="notion-row" style={{ cursor: 'default' }}>
                    <div className="notion-icon" style={{ background: s.bg }}>{s.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p className="notion-label">{s.label}</p>
                      <p className="notion-sub">{s.sub}</p>
                    </div>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: '#1a1714' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="section">
              <div className="section-label">Badges</div>
              <h2 className="section-title">{unlockedBadges}/{ACHIEVEMENTS.length} débloqués</h2>
              <p className="section-sub">Continue ta routine pour débloquer les suivants.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
                {ACHIEVEMENTS.map((badge, i) => {
                  const unlocked = streak >= badge.req
                  return (
                    <div key={i} className="badge-wrap" style={{ opacity: unlocked ? 1 : 0.25 }}>
                      <div className="badge-icon" style={{ background: unlocked ? `${badge.color}15` : '#f0ede8', border: unlocked ? `1.5px solid ${badge.color}30` : '1.5px solid #e8e4df', boxShadow: unlocked ? `0 4px 12px ${badge.color}20` : 'none' }}>
                        {badge.emoji}
                      </div>
                      <p className="badge-name">{badge.name}</p>
                      <p style={{ fontSize: '0.55rem', color: '#c4b5a5', fontWeight: 600 }}>{badge.req}j</p>
                    </div>
                  )
                })}
              </div>

              {streak < ACHIEVEMENTS[ACHIEVEMENTS.length - 1].req && (
                <div style={{ marginTop: '16px', background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #f0ede8', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{ACHIEVEMENTS.find(b => streak < b.req)?.emoji}</span>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1714' }}>Prochain badge : {ACHIEVEMENTS.find(b => streak < b.req)?.name}</p>
                    <p style={{ fontSize: '0.72rem', color: '#9b9189', marginTop: '2px' }}>Encore {(ACHIEVEMENTS.find(b => streak < b.req)?.req ?? 0) - streak} jours de streak</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ SUBSCRIPTION TAB ══ */}
        {activeTab === 'subscription' && (
          <div className="fade-up">
            <div className="section">
              <div className="section-label">Abonnement</div>
              <h2 className="section-title">Facetify Premium</h2>
              <p className="section-sub">Ton accès complet à la transformation de ta peau.</p>

              <div style={{ marginTop: '16px', background: '#1a1714', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #e8856a, transparent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Plan actuel</p>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Premium</p>
                  </div>
                  <div style={{ background: 'rgba(123,191,140,0.15)', border: '1px solid rgba(123,191,140,0.3)', borderRadius: '50px', padding: '4px 12px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7bbf8c' }}>● Actif</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>10€</span>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.35)' }}>/mois</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Routine 4 semaines personnalisée', 'Suivi photo + journal', 'Badges & gamification', 'IA + conseils quotidiens'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#7bbf8c', fontSize: '0.78rem' }}>✓</span>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="notion-block" style={{ marginTop: '14px' }}>
                {[
                  { icon: '📅', bg: '#f0f7ff', label: 'Date d\'inscription', value: programStart },
                  { icon: '💳', bg: '#f5f2ed', label: 'Prochain prélèvement', value: '15 mai 2024' },
                  { icon: '🔒', bg: '#f5f2ed', label: 'Annulation', value: 'En 1 clic' },
                ].map((item, i) => (
                  <div key={i} className="notion-row" style={{ cursor: 'default' }}>
                    <div className="notion-icon" style={{ background: item.bg }}>{item.icon}</div>
                    <p className="notion-label">{item.label}</p>
                    <p className="notion-value">{item.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '14px', background: 'rgba(232,90,90,0.04)', border: '1px solid rgba(232,90,90,0.12)', borderRadius: '14px', padding: '18px' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '0.95rem', fontWeight: 600, color: '#1a1714', marginBottom: '6px' }}>Annuler l'abonnement</p>
                <p style={{ fontSize: '0.78rem', color: '#9b9189', lineHeight: 1.6, marginBottom: '14px' }}>
                  Tu perdras l'accès à ta routine, tes progrès et ton streak actuel de {streak} jours.
                </p>
                <button className="btn-danger">Annuler mon abonnement</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ SETTINGS TAB ══ */}
        {activeTab === 'settings' && (
          <div className="fade-up">

            {/* Notifications */}
            <div className="section">
              <div className="section-label">Notifications</div>
              <h2 className="section-title">Rappels</h2>

              <div className="notion-block" style={{ marginTop: '16px' }}>
                {[
                  { key: 'morning', icon: '☀️', bg: 'rgba(255,196,100,0.1)', label: 'Rappel matin', sub: '7h30 · Chaque jour' },
                  { key: 'evening', icon: '🌙', bg: 'rgba(100,100,200,0.06)', label: 'Rappel soir', sub: '21h00 · Chaque jour' },
                  { key: 'tips', icon: '💡', bg: 'rgba(123,191,140,0.08)', label: 'Conseil IA', sub: 'Vers 12h · Chaque jour' },
                  { key: 'weekly', icon: '📊', bg: 'rgba(201,169,110,0.08)', label: 'Résumé hebdo', sub: 'Chaque dimanche' },
                ].map((notif) => (
                  <div key={notif.key} className="notion-row">
                    <div className="notion-icon" style={{ background: notif.bg }}>{notif.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p className="notion-label">{notif.label}</p>
                      <p className="notion-sub">{notif.sub}</p>
                    </div>
                    <button className={`toggle ${notifications[notif.key as keyof typeof notifications] ? 'on' : ''}`}
                      onClick={() => setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key as keyof typeof notifications] }))}>
                      <div className="toggle-dot" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Account */}
            <div className="section">
              <div className="section-label">Compte</div>
              <h2 className="section-title">Mon compte</h2>

              <div className="notion-block" style={{ marginTop: '16px' }}>
                {[
                  { icon: '✉️', bg: '#f0f7ff', label: 'Email', sub: user.email },
                  { icon: '🔑', bg: '#f5f2ed', label: 'Mot de passe', sub: 'Changer le mot de passe' },
                  { icon: '👤', bg: '#f5f2ed', label: 'Profil peau', sub: 'Refaire le diagnostic', action: () => router.push('/onboarding') },
                ].map((item, i) => (
                  <div key={i} className="notion-row" onClick={item.action}>
                    <div className="notion-icon" style={{ background: item.bg }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p className="notion-label">{item.label}</p>
                      <p className="notion-sub">{item.sub}</p>
                    </div>
                    {item.action && <span className="notion-arrow">›</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="section">
              <div className="section-label">FAQ</div>
              <h2 className="section-title">Questions fréquentes</h2>

              <div className="notion-block" style={{ marginTop: '16px' }}>
                {[
                  { q: 'Comment modifier mon type de peau ?', a: 'Va dans Réglages > Profil peau pour refaire le diagnostic complet.' },
                  { q: 'Puis-je annuler mon abonnement ?', a: 'Oui, annulation en 1 clic depuis l\'onglet Abonnement. Aucuns frais cachés.' },
                  { q: 'Mes données sont-elles sécurisées ?', a: 'Toutes tes données sont chiffrées via Supabase et ne sont jamais partagées.' },
                  { q: 'Comment contacter le support ?', a: 'Écris-nous à support@facetify.com. Réponse sous 24h garantie.' },
                ].map((item, i) => (
                  <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                    <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      {item.q}
                      <span style={{ color: '#c4b5a5', fontSize: '0.8rem', transition: 'transform 0.25s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', display: 'block', flexShrink: 0 }}>▾</span>
                    </button>
                    <div className="faq-answer">
                      <p style={{ fontSize: '0.82rem', color: '#9b9189', lineHeight: 1.65, padding: '0 18px 14px' }}>{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout */}
            <div className="section">
              <button onClick={handleSignOut} className="btn-primary" style={{ marginBottom: '10px' }}>
                Se déconnecter
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#c4b5a5' }}>
                Facetify v1.0 · <a href="#" style={{ color: '#e8856a', textDecoration: 'none' }}>CGU</a> · <a href="#" style={{ color: '#e8856a', textDecoration: 'none' }}>Confidentialité</a>
              </p>
            </div>

          </div>
        )}

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