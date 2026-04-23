'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const MOTIVATIONAL_MESSAGES = [
  { day: 1, msg: "Jour 1 — Chaque grand voyage commence par un premier pas. 🌱" },
  { day: 3, msg: "Ta peau commence à s'adapter. Continue ! ✨" },
  { day: 7, msg: "7 jours ! Ta barrière cutanée se renforce. 🏆" },
  { day: 14, msg: "2 semaines ! Les premières améliorations sont visibles. 🌿" },
  { day: 21, msg: "21 jours — ton habitude est maintenant ancrée. 🔥" },
  { day: 30, msg: "30 jours ! Transformation complète. Tu l'as fait. 🌟" },
]

const PHASES = [
  { name: "Nettoyage", days: "J.1–10", color: "#7bbf8c", desc: "Purifier la peau" },
  { name: "Réparation", days: "J.11–20", color: "#c9a96e", desc: "Restaurer la barrière" },
  { name: "Glow", days: "J.21–30", color: "#e8856a", desc: "Révéler l'éclat" },
]

const BADGES = [
  { id: 1, emoji: "🌱", name: "Premier pas", req: 1 },
  { id: 2, emoji: "🔥", name: "7 jours", req: 7 },
  { id: 3, emoji: "💎", name: "2 semaines", req: 14 },
  { id: 4, emoji: "🏆", name: "30 jours", req: 30 },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [checkedMorning, setCheckedMorning] = useState<boolean[]>([false, false, false])
  const [checkedEvening, setCheckedEvening] = useState<boolean[]>([false, false, false])
  const [streak] = useState(12)
  const [dayNumber] = useState(18)
  const [activeTab, setActiveTab] = useState<'today' | 'progress' | 'phases'>('today')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }
    getUser()
  }, [])

  const morningSteps = ["Nettoyant doux", "Sérum actif", "SPF 50"]
  const eveningSteps = ["Double nettoyage", "Traitement nuit", "Crème barrière"]
  const morningDone = checkedMorning.filter(Boolean).length
  const eveningDone = checkedEvening.filter(Boolean).length
  const totalDone = morningDone + eveningDone
  const todayProgress = Math.round((totalDone / 6) * 100)
  const currentPhase = dayNumber <= 10 ? 0 : dayNumber <= 20 ? 1 : 2
  const motivMsg = MOTIVATIONAL_MESSAGES.findLast(m => dayNumber >= m.day)?.msg ?? MOTIVATIONAL_MESSAGES[0].msg

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null
  const firstName = user.email?.split('@')[0] ?? 'toi'
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f7f4ef; font-family: 'DM Sans', sans-serif; }
        .check-btn { width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.07); background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; transition: all 0.2s; flex-shrink: 0; }
        .check-btn.done { background: #7bbf8c; border-color: #7bbf8c; color: white; }
        .step-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.07); transition: opacity 0.2s; }
        .step-row:last-child { border-bottom: none; }
        .step-row.done-row { opacity: 0.5; }
        .tab-btn { flex: 1; padding: 10px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; color: #8c8278; cursor: pointer; border-radius: 10px; transition: all 0.2s; }
        .tab-btn.active { background: white; color: #1a1714; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .badge-item { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: 0.3; transition: opacity 0.3s; }
        .badge-item.unlocked { opacity: 1; }
        .badge-emoji { width: 52px; height: 52px; border-radius: 16px; background: #f0ece4; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 2px solid rgba(0,0,0,0.07); }
        .badge-item.unlocked .badge-emoji { background: linear-gradient(135deg, #fff8f0, #fff); border-color: #c9a96e; box-shadow: 0 4px 12px rgba(201,169,110,0.2); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        @keyframes fillBar { from { width: 0%; } to { width: var(--target-width); } }
        .progress-fill { height: 100%; background: linear-gradient(to right, #7bbf8c, #a8d5b0); border-radius: 6px; animation: fillBar 1s 0.3s ease both; }
      `}</style>

      <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#f7f4ef', paddingBottom: '32px' }}>

        <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#8c8278', fontWeight: 500 }}>Bonjour,</p>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 500, color: '#1a1714', letterSpacing: '-0.02em' }}>
              {firstName} <span style={{ color: '#e8856a' }}>✦</span>
            </h1>
          </div>
          <button onClick={handleSignOut} style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', color: '#8c8278', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
            Déconnexion
          </button>
        </div>

        <div style={{ margin: '16px 20px 0', background: 'linear-gradient(135deg, #1a1714, #2d2420)', borderRadius: '20px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(232,133,106,0.1)' }} />
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            {PHASES[currentPhase].name} · Phase {currentPhase + 1}
          </p>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
            {motivMsg}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', margin: '12px 20px 0' }}>
          {[
            { label: 'Jour', value: `${dayNumber}/30` },
            { label: 'Streak', value: `${streak} 🔥` },
            { label: "Aujourd'hui", value: `${todayProgress}%` },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '14px 12px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.07)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1714', fontFamily: 'Fraunces, serif' }}>{stat.value}</p>
              <p style={{ fontSize: '0.7rem', color: '#8c8278', fontWeight: 500, marginTop: '2px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ margin: '12px 20px 0', background: 'white', borderRadius: '20px', padding: '18px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1714' }}>Programme 30 jours</span>
            <span style={{ fontSize: '0.82rem', color: '#e8856a', fontWeight: 700 }}>{Math.round((dayNumber / 30) * 100)}%</span>
          </div>
          <div style={{ height: '8px', background: '#f0ece4', borderRadius: '6px', overflow: 'hidden' }}>
            <div className="progress-fill" style={{ '--target-width': `${Math.round((dayNumber / 30) * 100)}%` } as any} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {PHASES.map((phase, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i <= currentPhase ? phase.color : 'rgba(0,0,0,0.1)' }} />
                <span style={{ fontSize: '0.68rem', color: i <= currentPhase ? '#1a1714' : '#8c8278', fontWeight: i === currentPhase ? 700 : 400 }}>{phase.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ margin: '12px 20px 0', background: '#f0ece4', borderRadius: '14px', padding: '4px', display: 'flex' }}>
          {[{ id: 'today', label: "Aujourd'hui" }, { id: 'progress', label: 'Progrès' }, { id: 'phases', label: 'Phases' }].map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id as any)}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'today' && (
          <div className="fade-up" style={{ margin: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '18px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>☀️</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1714' }}>Routine Matin</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: morningDone === 3 ? '#7bbf8c' : '#8c8278', fontWeight: 600 }}>{morningDone}/3 {morningDone === 3 ? '✓' : ''}</span>
              </div>
              {morningSteps.map((step, i) => (
                <div key={i} className={`step-row ${checkedMorning[i] ? 'done-row' : ''}`}>
                  <button className={`check-btn ${checkedMorning[i] ? 'done' : ''}`} onClick={() => setCheckedMorning(prev => { const n = [...prev]; n[i] = !n[i]; return n })}>
                    {checkedMorning[i] ? '✓' : ''}
                  </button>
                  <span style={{ fontSize: '0.88rem', color: '#1a1714', fontWeight: 500, textDecoration: checkedMorning[i] ? 'line-through' : 'none' }}>{step}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '18px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🌙</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1714' }}>Routine Soir</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: eveningDone === 3 ? '#7bbf8c' : '#8c8278', fontWeight: 600 }}>{eveningDone}/3 {eveningDone === 3 ? '✓' : ''}</span>
              </div>
              {eveningSteps.map((step, i) => (
                <div key={i} className={`step-row ${checkedEvening[i] ? 'done-row' : ''}`}>
                  <button className={`check-btn ${checkedEvening[i] ? 'done' : ''}`} onClick={() => setCheckedEvening(prev => { const n = [...prev]; n[i] = !n[i]; return n })}>
                    {checkedEvening[i] ? '✓' : ''}
                  </button>
                  <span style={{ fontSize: '0.88rem', color: '#1a1714', fontWeight: 500, textDecoration: checkedEvening[i] ? 'line-through' : 'none' }}>{step}</span>
                </div>
              ))}
            </div>

            <button onClick={() => router.push('/routine')} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#1a1714', color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
              Voir ma routine complète →
            </button>
            <button onClick={async () => {
              const res = await fetch('/api/stripe/checkout', { method: 'POST' })
              const data = await res.json()
              if (data.url) window.location.href = data.url
            }} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '2px solid #e8856a', background: 'transparent', color: '#e8856a', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
              💳 Commencer l'essai gratuit 7 jours
            </button>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="fade-up" style={{ margin: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', marginBottom: '16px', color: '#1a1714' }}>Tes badges</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {BADGES.map(badge => (
                  <div key={badge.id} className={`badge-item ${streak >= badge.req ? 'unlocked' : ''}`}>
                    <div className="badge-emoji">{badge.emoji}</div>
                    <span style={{ fontSize: '0.65rem', color: '#8c8278', textAlign: 'center', fontWeight: 500 }}>{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', marginBottom: '16px', color: '#1a1714' }}>Historique (7 jours)</h3>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                {['L','M','M','J','V','S','D'].map((day, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: i < 5 ? '#7bbf8c' : '#f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: i < 5 ? 'white' : '#8c8278' }}>
                      {i < 5 ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#8c8278' }}>{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'phases' && (
          <div className="fade-up" style={{ margin: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PHASES.map((phase, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '20px', border: `2px solid ${i === currentPhase ? phase.color : 'rgba(0,0,0,0.07)'}`, position: 'relative', overflow: 'hidden' }}>
                {i === currentPhase && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: phase.color, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: '50px' }}>EN COURS</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${phase.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {i === 0 ? '🌱' : i === 1 ? '🔧' : '✨'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1714' }}>Phase {i + 1} — {phase.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#8c8278' }}>{phase.days}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#8c8278' }}>{phase.desc}</p>
                {i < currentPhase && <p style={{ fontSize: '0.78rem', color: phase.color, fontWeight: 600, marginTop: '8px' }}>✓ Complétée</p>}
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  )
}