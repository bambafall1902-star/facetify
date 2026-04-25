'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, signOut } from '@/lib/auth'

const AI_TIPS = [
  { tip: "Dors plus tôt ce soir. Le cortisol du stress ralentit ta progression de 40%.", icon: "🌙" },
  { tip: "Ta peau réagit bien aux actifs. Continue cette routine sans modification.", icon: "✨" },
  { tip: "Bois 2L d'eau aujourd'hui. L'hydratation interne amplifie les résultats.", icon: "💧" },
  { tip: "Change ta taie d'oreiller ce soir. Les bactéries s'accumulent en 48h.", icon: "🛏️" },
  { tip: "Évite le sucre aujourd'hui. L'inflammation alimentaire aggrave l'acné.", icon: "🍃" },
  { tip: "Applique ton SPF même à l'intérieur. Les écrans émettent de la lumière bleue.", icon: "☀️" },
]

const PRODUCTS = [
  { name: "CeraVe Mousse Nettoyante", type: "Nettoyant", emoji: "🧴", note: 4.8, remaining: "~3 semaines" },
  { name: "The Ordinary Niacinamide 10%", type: "Sérum", emoji: "💊", note: 4.9, remaining: "~5 semaines" },
  { name: "Neutrogena Hydro Boost", type: "Hydratant", emoji: "💧", note: 4.7, remaining: "~4 semaines" },
  { name: "La Roche-Posay SPF50", type: "Protection", emoji: "☀️", note: 4.9, remaining: "~2 semaines" },
]

const CALENDAR_DATA = [
  true, true, true, false, true, true, true,
  true, false, true, true, true, true, true,
  true, true, true, true, false, false, null,
  null, null, null, null, null, null, null,
  null, null, null,
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [checkedMorning, setCheckedMorning] = useState([false, false, false, false])
  const [checkedEvening, setCheckedEvening] = useState([false, false, false])
  const [skinMood, setSkinMood] = useState<number | null>(null)
  const [routineDone, setRoutineDone] = useState(false)
  const [tipIndex] = useState(Math.floor(Math.random() * AI_TIPS.length))
  const [sliderPos, setSliderPos] = useState(50)
  const sliderRef = useRef<HTMLDivElement>(null)
 const [dayNumber, setDayNumber] = useState(1)
  const [streak, setStreak] = useState(0)
  const [skinScore, setSkinScore] = useState(45)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!progress) {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          day_number: 1,
          streak_count: 0,
          skin_score: 45,
          program_start_date: new Date().toISOString().split('T')[0]
        })
      } else {
        const start = new Date(progress.program_start_date)
        const today = new Date()
        const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        setDayNumber(Math.min(30, diff))
        setStreak(progress.streak_count ?? 0)
        setSkinScore(progress.skin_score ?? 45)
      }
    }
    getUser()
  }, [])

  const morningDone = checkedMorning.filter(Boolean).length
  const eveningDone = checkedEvening.filter(Boolean).length
  const totalDone = morningDone + eveningDone
  const todayPct = Math.round((totalDone / 7) * 100)
  const firstName = user?.email?.split('@')[0]?.replace(/[0-9]/g, '')
  const displayName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'toi'

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/login')
      router.refresh()
    }
  }

  const handleSlider = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setSliderPos(Math.max(5, Math.min(95, (x / rect.width) * 100)))
  }

  if (!user) return null
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2ed; font-family: 'DM Sans', sans-serif; color: #1a1714; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fillW { from{width:0} to{width:var(--w)} }
        @keyframes fillH { from{height:0} to{height:var(--h)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.1)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }

        .fade-up { animation: fadeUp 0.5s ease both; }

        /* CARDS */
        .card { background: white; border-radius: 24px; padding: 24px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
        .card-dark { background: #1a1714; border-radius: 24px; padding: 24px; margin-bottom: 16px; position: relative; overflow: hidden; }
        .card-coral { background: linear-gradient(135deg, #e8856a, #f0a088); border-radius: 24px; padding: 24px; margin-bottom: 16px; }
        .card-green { background: linear-gradient(135deg, #7bbf8c, #a8d5b0); border-radius: 24px; padding: 24px; margin-bottom: 16px; }

        /* CHECK BUTTONS */
        .check-btn { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #d4cec7; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; transition: all 0.3s; flex-shrink: 0; }
        .check-btn.done { background: #7bbf8c; border-color: #7bbf8c; color: white; animation: checkPop 0.3s ease; }
        .step-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,0.05); transition: opacity 0.3s; }
        .step-row:last-child { border-bottom: none; }
        .step-row.done { opacity: 0.4; }

        /* PROGRESS BARS */
        .bar-track { background: #f0ece4; border-radius: 8px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 8px; animation: fillW 1s ease both; }

        /* SCORE RING */
        .score-ring { position: relative; width: 100px; height: 100px; }
        .score-ring svg { transform: rotate(-90deg); }
        .score-number { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; }

        /* CALENDAR */
        .cal-day { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; }
        .cal-success { background: #7bbf8c; color: white; }
        .cal-miss { background: #f0ece4; color: #c4b5a5; }
        .cal-perfect { background: linear-gradient(135deg, #c9a96e, #e8c87a); color: white; }
        .cal-empty { background: transparent; color: #d4cec7; border: 1px dashed #e8e4df; }
        .cal-today { border: 2px solid #e8856a; }

        /* PRODUCT CARDS */
        .product-card { background: white; border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 14px; margin-bottom: 10px; transition: transform 0.2s; }
        .product-card:hover { transform: translateY(-2px); }

        /* MOOD BUTTONS */
        .mood-btn { flex: 1; padding: 14px; border-radius: 14px; border: 2px solid transparent; background: #f5f2ed; font-size: 1.4rem; cursor: pointer; transition: all 0.2s; text-align: center; }
        .mood-btn.selected { background: white; border-color: #e8856a; box-shadow: 0 4px 16px rgba(232,133,106,0.2); transform: scale(1.05); }

        /* SLIDER */
        .slider-wrap { position: relative; border-radius: 16px; overflow: hidden; height: 200px; cursor: ew-resize; user-select: none; }
        .slider-before { position: absolute; inset: 0; background: linear-gradient(135deg, #d4b896, #c09070); display: flex; align-items: center; justify-content: center; }
        .slider-after { position: absolute; inset: 0; background: linear-gradient(135deg, #e8c4a0, #f0d0b0); display: flex; align-items: center; justify-content: center; clip-path: inset(0 0 0 var(--clip)); }
        .slider-divider { position: absolute; top: 0; bottom: 0; width: 3px; background: white; box-shadow: 0 0 12px rgba(0,0,0,0.3); cursor: ew-resize; }
        .slider-handle { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; background: white; border-radius: 50%; box-shadow: 0 4px 16px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }

        /* NAV BOTTOM */
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: white; border-top: 1px solid rgba(0,0,0,0.06); display: flex; z-index: 50; padding: 8px 0 16px; box-shadow: 0 -8px 32px rgba(0,0,0,0.06); }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 600; color: #c4b5a5; cursor: pointer; padding: 6px; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.04em; }
        .nav-item.active { color: #e8856a; }
        .nav-icon { font-size: 1.2rem; }

        /* SECTION LABELS */
        .sec-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #c4b5a5; margin-bottom: 12px; }
        .sec-title { font-family: 'Fraunces, serif'; font-size: 1.2rem; font-weight: 600; color: #1a1714; margin-bottom: 4px; }

        /* BADGES */
        .badge-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
        .badge-bronze { background: rgba(205,127,50,0.12); color: #cd7f32; border: 1px solid rgba(205,127,50,0.2); }
        .badge-green { background: rgba(123,191,140,0.12); color: #7bbf8c; border: 1px solid rgba(123,191,140,0.2); }
        .badge-coral { background: rgba(232,133,106,0.12); color: #e8856a; border: 1px solid rgba(232,133,106,0.2); }
        .badge-gold { background: rgba(201,169,110,0.12); color: #c9a96e; border: 1px solid rgba(201,169,110,0.2); }

        /* METRIC ITEMS */
        .metric-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .metric-row:last-child { border-bottom: none; }
        .metric-label { font-size: 0.85rem; color: #8c8278; font-weight: 500; }
        .metric-value { font-size: 0.85rem; font-weight: 700; color: #1a1714; }
        .metric-bar { height: 4px; border-radius: 2px; background: #f0ece4; overflow: hidden; flex: 1; margin: 0 12px; }
        .metric-bar-fill { height: 100%; border-radius: 2px; }

        @media(max-width:500px) { .cal-day{width:32px;height:32px;} }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#f5f2ed', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* ══ SECTION 1 — HERO HEADER ══ */}
        <div style={{ background: 'linear-gradient(180deg, #1a1714 0%, #2d2420 100%)', padding: '20px 20px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(232,133,106,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(123,191,140,0.05)' }} />

          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 600, color: 'white', letterSpacing: '-0.02em' }}>
              Face<span style={{ color: '#e8856a' }}>tify</span>
            </div>
            <button onClick={handleSignOut} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'DM Sans', fontWeight: 500 }}>
              Déconnexion
            </button>
          </div>

          {/* Avatar + greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8856a, #c9a96e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '3px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
              {displayName.charAt(0)}
            </div>
            <div>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Bonjour,</p>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {displayName} <span style={{ color: '#e8856a', animation: 'pulse 2s infinite', display: 'inline-block' }}>✦</span>
              </h1>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jour</p>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{dayNumber}<span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>/30</span></p>
            </div>
          </div>

          {/* Dynamic message */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', borderLeft: '3px solid #e8856a' }}>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'Fraunces, serif', fontStyle: 'italic', lineHeight: 1.5 }}>
              "Jour {dayNumber} de transformation — Ta peau progresse. Continue, tu fais du bon travail."
            </p>
          </div>

          {/* Global progress */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Objectif 30 jours</span>
              <span style={{ fontSize: '0.72rem', color: '#e8856a', fontWeight: 700 }}>{Math.round((dayNumber/30)*100)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.round((dayNumber/30)*100)}%`, background: 'linear-gradient(to right, #e8856a, #f0a088)', borderRadius: '3px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {['Nettoyage', 'Réparation', 'Glow'].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 1 ? '#e8856a' : i === 0 ? '#7bbf8c' : 'rgba(255,255,255,0.15)' }} />
                  <span style={{ fontSize: '0.65rem', color: i === 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', fontWeight: i === 1 ? 700 : 400 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button onClick={() => router.push('/routine')} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: '#e8856a', color: 'white', fontFamily: 'DM Sans', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(232,133,106,0.4)' }}>
            ✨ Faire ma routine du jour →
          </button>
        </div>

        <div style={{ padding: '0 16px' }}>

        {/* ══ SECTION 2 — SKIN SCORE ══ */}
        <div style={{ margin: '16px 0' }}>
          <div className="sec-label" style={{ paddingTop: '4px' }}>Score de peau</div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              {/* Score ring */}
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle cx="45" cy="45" r="36" fill="none" stroke="#e8856a" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 36 * skinScore / 100} ${2 * Math.PI * 36}`}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px', transition: 'stroke-dasharray 1.5s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{skinScore}</span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>/100</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Skin Score</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(123,191,140,0.15)', border: '1px solid rgba(123,191,140,0.25)', borderRadius: '50px', padding: '3px 10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#7bbf8c', fontWeight: 700 }}>↑ +12% ce mois</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>Ta peau s'améliore chaque semaine. Continue cette dynamique.</p>
              </div>
            </div>
            {/* Metrics */}
            {[
              { label: 'Hydratation', value: 'Bonne', pct: 78, color: '#7bbf8c' },
              { label: 'Inflammation', value: 'En baisse', pct: 35, color: '#e8856a' },
              { label: 'Régularité', value: 'Excellente', pct: 94, color: '#c9a96e' },
              { label: 'Éclat', value: 'En progression', pct: 62, color: '#b89dff' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, width: '90px', flexShrink: 0 }}>{m.label}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: '2px', transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: m.color, fontWeight: 700, width: '90px', textAlign: 'right' }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 3 — ROUTINE DU JOUR ══ */}
        <div className="sec-label">Routine du jour · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <div className="card">
          {/* Today progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 600, color: '#1a1714' }}>Checklist du jour</p>
              <p style={{ fontSize: '0.75rem', color: '#8c8278', marginTop: '2px' }}>{totalDone}/7 étapes complétées</p>
            </div>
            <div style={{ width: '52px', height: '52px', position: 'relative' }}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="20" fill="none" stroke="#f0ece4" strokeWidth="5" />
                <circle cx="26" cy="26" r="20" fill="none" stroke={todayPct === 100 ? '#7bbf8c' : '#e8856a'} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20 * todayPct / 100} ${2 * Math.PI * 20}`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '26px 26px' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1a1714' }}>{todayPct}%</span>
              </div>
            </div>
          </div>

          {/* Morning */}
          <div style={{ background: '#fffbf7', borderRadius: '14px', padding: '14px', marginBottom: '12px', border: '1px solid rgba(232,133,106,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(255,196,100,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☀️</div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1714' }}>Routine Matin</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: morningDone === 4 ? '#7bbf8c' : '#8c8278', fontWeight: 700 }}>{morningDone}/4</span>
            </div>
            {['Nettoyant doux', 'Sérum niacinamide', 'Hydratant léger', 'SPF 50'].map((step, i) => (
              <div key={i} className={`step-row ${checkedMorning[i] ? 'done' : ''}`}>
                <button className={`check-btn ${checkedMorning[i] ? 'done' : ''}`}
                  onClick={() => setCheckedMorning(prev => { const n = [...prev]; n[i] = !n[i]; return n })}>
                  {checkedMorning[i] ? '✓' : ''}
                </button>
                <span style={{ fontSize: '0.88rem', color: '#1a1714', fontWeight: 500, flex: 1, textDecoration: checkedMorning[i] ? 'line-through' : 'none' }}>{step}</span>
                <span style={{ fontSize: '0.68rem', color: '#c4b5a5', background: '#f5f2ed', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                  {['60s','30s','20s','–'][i]}
                </span>
              </div>
            ))}
          </div>

          {/* Evening */}
          <div style={{ background: '#f7f5ff', borderRadius: '14px', padding: '14px', border: '1px solid rgba(100,100,200,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(100,100,200,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌙</div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1714' }}>Routine Soir</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: eveningDone === 3 ? '#7bbf8c' : '#8c8278', fontWeight: 700 }}>{eveningDone}/3</span>
            </div>
            {['Double nettoyage', 'Traitement acné', 'Hydratation réparatrice'].map((step, i) => (
              <div key={i} className={`step-row ${checkedEvening[i] ? 'done' : ''}`}>
                <button className={`check-btn ${checkedEvening[i] ? 'done' : ''}`}
                  onClick={() => setCheckedEvening(prev => { const n = [...prev]; n[i] = !n[i]; return n })}>
                  {checkedEvening[i] ? '✓' : ''}
                </button>
                <span style={{ fontSize: '0.88rem', color: '#1a1714', fontWeight: 500, flex: 1, textDecoration: checkedEvening[i] ? 'line-through' : 'none' }}>{step}</span>
                <span style={{ fontSize: '0.68rem', color: '#c4b5a5', background: '#f5f2ed', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                  {['90s','45s','–'][i]}
                </span>
              </div>
            ))}
          </div>

          {totalDone === 7 && (
            <div style={{ marginTop: '16px', background: 'linear-gradient(135deg, #7bbf8c, #a8d5b0)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🎉</p>
              <p style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: 'white', fontSize: '1rem' }}>Routine du jour complète !</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>Ta peau te remercie. Streak maintenu ! 🔥</p>
            </div>
          )}
        </div>
        {/* ══ SECTION 4 — STREAK & DISCIPLINE ══ */}
        <div className="sec-label">Streak & Discipline</div>
        <div className="card-dark">
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(232,133,106,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '2.5rem', animation: 'pulse 1.5s infinite', display: 'inline-block' }}>🔥</div>
            <div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{streak} jours</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>consécutifs sans interruption</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="badge-pill badge-bronze">🥉 Bronze</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>94%</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Constance</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>+3</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vs sem. passée</p>
            </div>
          </div>
          <div style={{ background: 'rgba(232,133,106,0.08)', border: '1px solid rgba(232,133,106,0.15)', borderRadius: '12px', padding: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'Fraunces, serif', fontStyle: 'italic', lineHeight: 1.5 }}>
              "Tu es en train de construire une peau durable. Chaque jour compte."
            </p>
          </div>
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prochain badge dans</p>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(streak/21)*100}%`, background: 'linear-gradient(to right, #c9a96e, #e8c87a)', borderRadius: '3px' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '6px' }}>🥈 Argent à 21 jours · encore {21-streak} jours</p>
          </div>
        </div>

        {/* ══ SECTION 5 — AVANT / APRÈS ══ */}
        <div className="sec-label">Tes progrès visuels</div>
        <div className="card">
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 600, color: '#1a1714', marginBottom: '4px' }}>Avant / Après</p>
          <p style={{ fontSize: '0.78rem', color: '#8c8278', marginBottom: '16px' }}>Glisse le curseur pour comparer</p>
          <div ref={sliderRef} className="slider-wrap" onMouseMove={handleSlider} onClick={handleSlider}
            style={{ '--clip': `${sliderPos}%` } as any}>
            <div className="slider-before" style={{ background: 'linear-gradient(135deg, #c4a882, #8a6040)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '50px' }}>Semaine 1</p>
                <p style={{ fontSize: '2rem', marginTop: '8px' }}>😟</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Acné visible</p>
              </div>
            </div>
            <div className="slider-after" style={{ background: 'linear-gradient(135deg, #e8c4a0, #d4a880)', '--clip': `${sliderPos}%` } as any}>
              <div style={{ textAlign: 'center', paddingLeft: `${100-sliderPos}%` }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '50px', whiteSpace: 'nowrap' }}>Semaine {Math.ceil(dayNumber/7)}</p>
                <p style={{ fontSize: '2rem', marginTop: '8px' }}>😊</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px', whiteSpace: 'nowrap' }}>Amélioration visible</p>
              </div>
            </div>
            <div className="slider-divider" style={{ left: `${sliderPos}%` }}>
              <div className="slider-handle" style={{ left: '50%', transform: 'translate(-50%, -50%)' }}>↔</div>
            </div>
          </div>
          <button onClick={() => router.push('/progress')} style={{ width: '100%', marginTop: '14px', padding: '13px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', background: '#f5f2ed', color: '#1a1714', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
            📸 Ajouter ma photo de la semaine →
          </button>
        </div>

        {/* ══ SECTION 6 — CONSEIL IA ══ */}
        <div className="sec-label">Conseil IA du jour</div>
        <div className="card-dark" style={{ background: 'linear-gradient(135deg, #1a3a2a, #0f2318)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(123,191,140,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
              {AI_TIPS[tipIndex].icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.65rem', color: '#7bbf8c', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Intelligence artificielle</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7bbf8c', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              </div>
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
                "{AI_TIPS[tipIndex].tip}"
              </p>
            </div>
          </div>
        </div>

        {/* ══ SECTION 7 — CALENDRIER ══ */}
        <div className="sec-label">Calendrier du mois</div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714' }}>
              {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.68rem', color: '#7bbf8c', fontWeight: 700, background: 'rgba(123,191,140,0.1)', padding: '3px 8px', borderRadius: '6px' }}>✔ Réussi</span>
              <span style={{ fontSize: '0.68rem', color: '#c9a96e', fontWeight: 700, background: 'rgba(201,169,110,0.1)', padding: '3px 8px', borderRadius: '6px' }}>⭐ Parfait</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '12px' }}>
            {['L','M','M','J','V','S','D'].map((d,i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#c4b5a5', padding: '4px 0', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {CALENDAR_DATA.map((day, i) => (
              <div key={i} className={`cal-day ${day === true ? (i % 7 === 0 ? 'cal-perfect' : 'cal-success') : day === false ? 'cal-miss' : 'cal-empty'} ${i === dayNumber - 1 ? 'cal-today' : ''}`} style={{ fontSize: '0.72rem', fontWeight: 700, margin: '0 auto' }}>
                {day === true ? (i % 7 === 0 ? '⭐' : '✔') : day === false ? '○' : i < dayNumber ? String(i+1) : ''}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '14px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#8c8278' }}>✔ {CALENDAR_DATA.filter(d => d === true).length} jours réussis</span>
            <span style={{ fontSize: '0.75rem', color: '#8c8278' }}>○ {CALENDAR_DATA.filter(d => d === false).length} manqués</span>
          </div>
        </div>

        {/* ══ SECTION 8 — PRODUITS ══ */}
        <div className="sec-label">Tes produits actuels</div>
        {PRODUCTS.map((p, i) => (
          <div key={i} className="product-card">
            <div style={{ width: '44px', height: '44px', background: '#f5f2ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
              {p.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1714', marginBottom: '2px' }}>{p.name}</p>
              <p style={{ fontSize: '0.72rem', color: '#8c8278' }}>{p.type} · Reste {p.remaining}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ fontSize: '0.6rem', color: j < Math.floor(p.note) ? '#c9a96e' : '#e8e4df' }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#c9a96e', fontWeight: 700 }}>{p.note}</span>
            </div>
          </div>
        ))}

        {/* ══ SECTION 9 — PROCHAINE PHASE ══ */}
        <div className="sec-label">Ce qui t'attend</div>
        <div style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)', borderRadius: '24px', padding: '24px', marginBottom: '16px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(201,169,110,0.2)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, #c9a96e, transparent)' }} />
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,169,110,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.65rem', color: '#c9a96e', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Dans {30 - dayNumber} jours</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,169,110,0.2)' }} />
          </div>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '8px' }}>
            Phase 3 : <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Glow & Éclat</span>
          </p>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '16px' }}>
            La dernière phase va révéler l'éclat naturel de ta peau. Nouveaux actifs, routine plus avancée, résultats spectaculaires.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Vitamine C', 'Rétinol 0.3%', 'Acide glycolique'].map((a, i) => (
              <span key={i} style={{ fontSize: '0.68rem', fontWeight: 600, color: '#c9a96e', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', padding: '4px 10px', borderRadius: '50px' }}>
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* ══ SECTION 10 — HUMEUR PEAU ══ */}
        <div className="sec-label">Comment est ta peau aujourd'hui ?</div>
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            {[{ emoji: '🙂', label: 'Bien' }, { emoji: '😐', label: 'Moyen' }, { emoji: '😣', label: 'Difficile' }].map((m, i) => (
              <button key={i} className={`mood-btn ${skinMood === i ? 'selected' : ''}`} onClick={() => setSkinMood(i)}>
                <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{m.emoji}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: skinMood === i ? '#e8856a' : '#8c8278' }}>{m.label}</div>
              </button>
            ))}
          </div>
          {skinMood !== null && (
            <div style={{ background: '#f5f2ed', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.82rem', color: '#1a1714', fontWeight: 500 }}>
                {skinMood === 0 ? '✨ Super ! Continue ta routine sans modification.' : skinMood === 1 ? '💡 Normal en phase 2. Reste régulier(e).' : '🤗 Ça arrive. Note-le et reste constant(e).'}
              </p>
            </div>
          )}
        </div>

        {/* ══ SECTION 11 — FOOTER NAV ══ */}
        <div className="card" style={{ marginBottom: '0' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714', marginBottom: '14px' }}>Mon compte</p>
          {[
            { icon: '⚙️', label: 'Paramètres', sub: 'Notifications, préférences' },
            { icon: '💳', label: 'Mon abonnement', sub: '10€/mois · Actif' },
            { icon: '📊', label: 'Historique complet', sub: '18 jours de données' },
            { icon: '💬', label: 'Support', sub: 'Nous contacter' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: '40px', height: '40px', background: '#f5f2ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1714' }}>{item.label}</p>
                <p style={{ fontSize: '0.72rem', color: '#8c8278', marginTop: '1px' }}>{item.sub}</p>
              </div>
              <span style={{ color: '#c4b5a5', fontSize: '0.9rem' }}>›</span>
            </div>
          ))}
        </div>

        </div>{/* end padding div */}

        {/* ══ BOTTOM NAVIGATION ══ */}
        <div className="bottom-nav">
          {[
            { icon: '🏠', label: 'Accueil', active: true, action: () => {} },
            { icon: '📋', label: 'Routine', active: false, action: () => router.push('/routine') },
            { icon: '📸', label: 'Progrès', active: false, action: () => router.push('/progress') },
           { icon: '👤', label: 'Profil', active: false, action: () => router.push('/profile') },
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