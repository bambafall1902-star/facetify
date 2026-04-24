'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const PHASES = [
  { name: "Nettoyage", days: "J.1–10", color: "#7bbf8c", icon: "🌱", desc: "Purifier en profondeur" },
  { name: "Réparation", days: "J.11–20", color: "#c9a96e", icon: "🔧", desc: "Restaurer la barrière" },
  { name: "Glow", days: "J.21–30", color: "#e8856a", icon: "✨", desc: "Révéler l'éclat naturel" },
]

const MOTIVATIONAL = [
  { day: 1, msg: "Jour 1 — Le premier pas est toujours le plus important.", sub: "Ta peau va adorer ce que tu t'apprêtes à faire." },
  { day: 3, msg: "3 jours — Tu es sur la bonne voie.", sub: "Ta peau commence à s'adapter à ta nouvelle routine." },
  { day: 7, msg: "7 jours — Une semaine complète ! 🎉", sub: "Ta barrière cutanée se renforce chaque jour." },
  { day: 10, msg: "10 jours — Phase 1 terminée !", sub: "Prépare-toi pour la phase de réparation." },
  { day: 14, msg: "2 semaines — Les premières améliorations sont visibles.", sub: "Continue, les résultats s'accélèrent maintenant." },
  { day: 21, msg: "21 jours — Ton habitude est maintenant ancrée.", sub: "La science dit qu'il faut 21 jours pour créer une habitude." },
  { day: 28, msg: "28 jours — La ligne d'arrivée approche !", sub: "Ta peau n'a jamais été aussi bien nourrie." },
  { day: 30, msg: "30 jours — Transformation complète. 🌟", sub: "Tu as tenu ta promesse envers ta peau." },
]

const BADGES = [
  { id: 1, emoji: "🌱", name: "Premier pas", desc: "Jour 1 complété", req: 1, color: "#7bbf8c" },
  { id: 2, emoji: "💧", name: "Hydraté(e)", desc: "3 jours de suite", req: 3, color: "#7bbf8c" },
  { id: 3, emoji: "🔥", name: "En feu", desc: "7 jours de streak", req: 7, color: "#e8856a" },
  { id: 4, emoji: "⭐", name: "Régulier(e)", desc: "10 jours complétés", req: 10, color: "#c9a96e" },
  { id: 5, emoji: "💎", name: "Diamant", desc: "2 semaines de suite", req: 14, color: "#b89dff" },
  { id: 6, emoji: "🏆", name: "Champion(ne)", desc: "30 jours complétés", req: 30, color: "#e8856a" },
]

const TIPS = [
  "Boire 2L d'eau par jour réduit l'acné de 30% en moyenne.",
  "Changer ta taie d'oreiller tous les 2-3 jours aide à réduire les bactéries.",
  "Le stress augmente le cortisol, qui stimule la production de sébum.",
  "Ne jamais toucher son visage avec les mains = règle d'or anti-acné.",
  "Dormir 8h minimum permet à ta peau de se régénérer complètement.",
  "Le sucre raffiné est l'ennemi #1 d'une peau nette.",
  "Nettoyer son téléphone quotidiennement réduit les boutons sur les joues.",
  "La vitamine C le matin + rétinol le soir = combo parfait anti-taches.",
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [checkedMorning, setCheckedMorning] = useState<boolean[]>([false, false, false])
  const [checkedEvening, setCheckedEvening] = useState<boolean[]>([false, false, false])
  const [activeTab, setActiveTab] = useState<'today' | 'progress' | 'tips' | 'phases'>('today')
  const [dayNumber] = useState(18)
  const [streak] = useState(12)
  const [tipIndex] = useState(Math.floor(Math.random() * TIPS.length))
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
  const programProgress = Math.round((dayNumber / 30) * 100)
  const currentPhase = dayNumber <= 10 ? 0 : dayNumber <= 20 ? 1 : 2
  const motiv = MOTIVATIONAL.findLast(m => dayNumber >= m.day) ?? MOTIVATIONAL[0]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null
  const firstName = user.email?.split('@')[0]?.replace(/[0-9]/g, '') ?? 'toi'
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f7f4ef; font-family: 'DM Sans', sans-serif; color: #1a1714; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fillBar { from { width: 0%; } to { width: var(--w); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }

        .fade-up { animation: fadeUp 0.4s ease both; }
        .slide-in { animation: slideIn 0.3s ease both; }

        .tab-btn { flex: 1; padding: 10px 6px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; color: #8c8278; cursor: pointer; border-radius: 10px; transition: all 0.2s; letter-spacing: 0.01em; }
        .tab-btn.active { background: white; color: #1a1714; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

        .check-btn { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #d4cec7; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; transition: all 0.25s; flex-shrink: 0; }
        .check-btn.done { background: #7bbf8c; border-color: #7bbf8c; color: white; transform: scale(1.05); }

        .step-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,0.05); transition: opacity 0.3s; }
        .step-row:last-child { border-bottom: none; }
        .step-row.done-row { opacity: 0.45; }

        .card { background: white; border-radius: 20px; padding: 20px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 12px; }
        .card-sm { background: white; border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.06); }

        .stat-card { background: white; border-radius: 16px; padding: 16px 12px; text-align: center; border: 1px solid rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

        .badge-item { display: flex; flex-direction: column; align-items: center; gap: 6px; transition: transform 0.2s; }
        .badge-item:hover { transform: translateY(-2px); }
        .badge-emoji-wrap { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 2px solid rgba(0,0,0,0.06); background: #f0ece4; transition: all 0.3s; }
        .badge-item.unlocked .badge-emoji-wrap { background: linear-gradient(135deg, #fff8f0, #fff); border-color: #c9a96e; box-shadow: 0 4px 16px rgba(201,169,110,0.25); }
        .badge-item.locked { opacity: 0.3; }

        .tip-card { background: linear-gradient(135deg, #1a1714, #2d2420); border-radius: 20px; padding: 24px; color: white; position: relative; overflow: hidden; margin-bottom: 12px; }
        .tip-card::before { content: ''; position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; border-radius: 50%; background: rgba(232,133,106,0.08); }

        .phase-card { background: white; border-radius: 16px; padding: 18px; border: 2px solid rgba(0,0,0,0.06); margin-bottom: 10px; transition: all 0.2s; position: relative; overflow: hidden; }
        .phase-card.active-phase { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

        .progress-bar-track { height: 8px; background: #f0ece4; border-radius: 6px; overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 6px; animation: fillBar 1s 0.3s ease both; }

        .action-btn { width: 100%; padding: 16px; border-radius: 14px; border: none; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em; }
        .action-btn-primary { background: #1a1714; color: white; }
        .action-btn-primary:hover { background: #2d2420; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(26,23,20,0.2); }
        .action-btn-coral { background: transparent; color: #e8856a; border: 2px solid #e8856a; }
        .action-btn-coral:hover { background: rgba(232,133,106,0.05); transform: translateY(-1px); }

        .today-complete { background: linear-gradient(135deg, #7bbf8c, #a8d5b0); border-radius: 20px; padding: 24px; text-align: center; color: white; margin-bottom: 12px; }

        .streak-fire { animation: pulse 1.5s ease-in-out infinite; display: inline-block; }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', background: '#f7f4ef', paddingBottom: '40px' }}>

        {/* ── HEADER ── */}
        <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: '#8c8278', fontWeight: 500 }}>Bonjour,</p>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 600, color: '#1a1714', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {displayName} <span style={{ color: '#e8856a' }}>✦</span>
            </h1>
          </div>
          <button onClick={handleSignOut} style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', color: '#8c8278', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s' }}>
            Déconnexion
          </button>
        </div>

        {/* ── MOTIVATIONAL BANNER ── */}
        <div style={{ margin: '16px 20px 0', background: 'linear-gradient(135deg, #1a1714 0%, #2d2420 100%)', borderRadius: '20px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, borderRadius: '50%', background: `${PHASES[currentPhase].color}12` }} />
          <div style={{ position: 'absolute', bottom: -40, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: PHASES[currentPhase].color, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Phase {currentPhase + 1} · {PHASES[currentPhase].name}
            </span>
          </div>
          <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, marginBottom: '6px' }}>
            "{motiv.msg}"
          </p>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{motiv.sub}</p>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', margin: '12px 20px 0' }}>
          <div className="stat-card">
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: '#1a1714', lineHeight: 1 }}>{dayNumber}<span style={{ fontSize: '0.8rem', color: '#8c8278', fontFamily: 'DM Sans' }}>/30</span></p>
            <p style={{ fontSize: '0.68rem', color: '#8c8278', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Jour</p>
          </div>
          <div className="stat-card">
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: '#1a1714', lineHeight: 1 }}>
              {streak} <span className="streak-fire">🔥</span>
            </p>
            <p style={{ fontSize: '0.68rem', color: '#8c8278', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Streak</p>
          </div>
          <div className="stat-card" style={{ background: todayProgress === 100 ? 'linear-gradient(135deg, #7bbf8c, #a8d5b0)' : 'white' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, color: todayProgress === 100 ? 'white' : '#1a1714', lineHeight: 1 }}>{todayProgress}%</p>
            <p style={{ fontSize: '0.68rem', color: todayProgress === 100 ? 'rgba(255,255,255,0.8)' : '#8c8278', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Auj.</p>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="card" style={{ margin: '12px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1714' }}>Programme 30 jours</span>
            <span style={{ fontSize: '0.85rem', color: PHASES[currentPhase].color, fontWeight: 700 }}>{programProgress}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ '--w': `${programProgress}%`, background: `linear-gradient(to right, ${PHASES[currentPhase].color}, ${PHASES[currentPhase].color}99)` } as any} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            {PHASES.map((phase, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem' }}>{phase.icon}</span>
                <span style={{ fontSize: '0.68rem', color: i <= currentPhase ? '#1a1714' : '#c4b5a5', fontWeight: i === currentPhase ? 700 : 400 }}>{phase.name}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
    </>
  )
}