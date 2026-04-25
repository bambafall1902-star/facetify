'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const PROGRESS_PHOTOS = [
  { week: 1, day: 1, emoji: '😟', label: 'Début', score: 45, date: 'Sem. 1' },
  { week: 2, day: 7, emoji: '😐', label: 'Semaine 1', score: 58, date: 'Sem. 2' },
  { week: 3, day: 14, emoji: '🙂', label: 'Semaine 2', score: 68, date: 'Sem. 3' },
  { week: 4, day: 18, emoji: '😊', label: 'Aujourd\'hui', score: 78, date: 'Sem. 4' },
]

const WEEKLY_NOTES = [
  { week: 1, note: 'Peau encore réactive. Quelques boutons. Début de la routine.', mood: '😟', date: 'J.1' },
  { week: 2, note: 'Légère amélioration. Moins de brillance. Routine bien intégrée.', mood: '😐', date: 'J.7' },
  { week: 3, note: 'Boutons actifs en baisse. Teint plus uniforme. Très motivé(e).', mood: '🙂', date: 'J.14' },
  { week: 4, note: 'Vraie amélioration visible. Peau plus douce. Streak à 12 jours !', mood: '😊', date: 'J.18' },
]

const STATS_EVOLUTION = [
  { label: 'Hydratation', start: 30, current: 78, color: '#7bbf8c' },
  { label: 'Inflammation', start: 80, current: 35, color: '#e8856a', inverted: true },
  { label: 'Régularité', start: 0, current: 94, color: '#c9a96e' },
  { label: 'Éclat', start: 20, current: 62, color: '#b89dff' },
]

export default function ProgressPage() {
  const [user, setUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<'timeline' | 'stats' | 'notes'>('timeline')
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [newNote, setNewNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.1)} }
        @keyframes fillW { from{width:0} to{width:var(--w)} }
        @keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .card { background: white; border-radius: 20px; padding: 20px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .tab-btn { flex: 1; padding: 11px 8px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-radius: 10px; transition: all 0.2s; color: #8c8278; }
        .tab-btn.active { background: white; color: #1a1714; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .photo-card { border-radius: 16px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; position: relative; }
        .photo-card.selected { border-color: #e8856a; box-shadow: 0 8px 24px rgba(232,133,106,0.2); }
        .photo-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .timeline-item { display: flex; gap: 14px; position: relative; }
        .timeline-item::before { content: ''; position: absolute; left: 19px; top: 40px; bottom: -14px; width: 2px; background: rgba(0,0,0,0.06); }
        .timeline-item:last-child::before { display: none; }
        .timeline-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .note-card { background: #f9f7f4; border-radius: 14px; padding: 14px; border: 1px solid rgba(0,0,0,0.05); margin-bottom: 10px; }
        .slider-wrap { position: relative; border-radius: 16px; overflow: hidden; height: 220px; cursor: ew-resize; user-select: none; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: white; border-top: 1px solid rgba(0,0,0,0.06); display: flex; z-index: 50; padding: 8px 0 16px; box-shadow: 0 -8px 32px rgba(0,0,0,0.06); }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 600; color: #c4b5a5; cursor: pointer; padding: 6px; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.04em; }
        .nav-item.active { color: #e8856a; }
        .nav-icon { font-size: 1.2rem; }
        .upload-zone { border: 2px dashed rgba(232,133,106,0.3); border-radius: 16px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(232,133,106,0.02); }
        .upload-zone:hover { border-color: #e8856a; background: rgba(232,133,106,0.05); }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#f5f2ed', minHeight: '100vh', paddingBottom: '100px' }}>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(180deg, #1a1714, #2d2420)', padding: '20px 20px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(123,191,140,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans' }}>←</button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Facetify · Jour 18</p>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>Mes Progrès</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '2rem', fontFamily: 'Fraunces, serif', fontWeight: 700, color: 'white', lineHeight: 1 }}>78</p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Skin Score</p>
            </div>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { label: 'Score initial', value: '45', sub: 'Semaine 1' },
              { label: 'Score actuel', value: '78', sub: '+33 points', highlight: true },
              { label: 'Objectif', value: '90', sub: 'Dans 12j' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.highlight ? 'rgba(123,191,140,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '10px', textAlign: 'center', border: s.highlight ? '1px solid rgba(123,191,140,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: s.highlight ? '#7bbf8c' : 'white', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>
            {/* TABS */}
          <div style={{ margin: '16px 0 14px', background: '#ede9e2', borderRadius: '14px', padding: '4px', display: 'flex' }}>
            {[
              { id: 'timeline', label: '📸 Timeline' },
              { id: 'stats', label: '📊 Stats' },
              { id: 'notes', label: '📝 Notes' },
            ].map(tab => (
              <button key={tab.id} className={`tab-btn ${activeSection === tab.id ? 'active' : ''}`}
                onClick={() => setActiveSection(tab.id as any)}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══ TIMELINE TAB ══ */}
          {activeSection === 'timeline' && (
            <div className="fade-up">

              {/* Photo grid */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Photos de progression
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {PROGRESS_PHOTOS.map((photo, i) => (
                  <div key={i} className={`photo-card ${selectedPhoto === i ? 'selected' : ''}`}
                    onClick={() => setSelectedPhoto(selectedPhoto === i ? null : i)}>
                    <div style={{ height: '120px', background: `linear-gradient(135deg, hsl(${20 + i*15}, ${40 + i*5}%, ${50 + i*8}%), hsl(${30 + i*10}, ${35 + i*5}%, ${40 + i*8}%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      {photo.emoji}
                    </div>
                    <div style={{ background: 'white', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a1714' }}>{photo.label}</p>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7bbf8c', background: 'rgba(123,191,140,0.1)', padding: '2px 8px', borderRadius: '50px' }}>{photo.score}</span>
                      </div>
                      <p style={{ fontSize: '0.65rem', color: '#8c8278', marginTop: '2px' }}>{photo.date}</p>
                    </div>
                    {selectedPhoto === i && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px', background: '#e8856a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>✓</div>
                    )}
                  </div>
                ))}

                {/* Upload new */}
                <div className="upload-zone" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📸</div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e8856a' }}>Ajouter photo</p>
                  <p style={{ fontSize: '0.65rem', color: '#c4b5a5' }}>Semaine 4</p>
                </div>
              </div>

              {/* Avant/Après slider */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Comparaison avant / après
              </p>
              <div className="card" style={{ padding: '16px' }}>
                <div ref={sliderRef} className="slider-wrap" onMouseMove={handleSlider} onClick={handleSlider}>
                  {/* Before */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #c4a882, #8a6040)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '3rem', marginBottom: '8px' }}>😟</p>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 14px', borderRadius: '50px', display: 'inline-block' }}>
                        <p style={{ fontSize: '0.72rem', color: 'white', fontWeight: 700 }}>Avant · Score 45</p>
                      </div>
                    </div>
                  </div>
                  {/* After */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8c4a0, #d4a070)', clipPath: `inset(0 0 0 ${sliderPos}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', paddingLeft: `${Math.max(0, sliderPos - 20)}%` }}>
                      <p style={{ fontSize: '3rem', marginBottom: '8px' }}>😊</p>
                      <div style={{ background: 'rgba(123,191,140,0.4)', padding: '4px 14px', borderRadius: '50px', display: 'inline-block' }}>
                        <p style={{ fontSize: '0.72rem', color: 'white', fontWeight: 700 }}>Aujourd'hui · Score 78</p>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderPos}%`, width: '3px', background: 'white', boxShadow: '0 0 12px rgba(0,0,0,0.3)', transform: 'translateX(-50%)' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '36px', height: '36px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '0.8rem', fontWeight: 700, color: '#1a1714' }}>↔</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#8c8278', textAlign: 'center', marginTop: '10px' }}>
                  Glisse pour comparer · +33 points de progression
                </p>
              </div>

              {/* Timeline */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Timeline de transformation
              </p>
              <div className="card">
                {PROGRESS_PHOTOS.map((photo, i) => (
                  <div key={i} className="timeline-item" style={{ marginBottom: i < PROGRESS_PHOTOS.length - 1 ? '20px' : '0' }}>
                    <div className="timeline-dot" style={{ background: `hsl(${20 + i*20}, 60%, ${55 + i*5}%)` }}>
                      {photo.emoji}
                    </div>
                    <div style={{ flex: 1, paddingBottom: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1714' }}>{photo.label}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.7rem', color: '#c4b5a5' }}>{photo.date}</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7bbf8c', background: 'rgba(123,191,140,0.1)', padding: '2px 8px', borderRadius: '50px' }}>Score {photo.score}</span>
                        </div>
                      </div>
                      <div style={{ height: '6px', background: '#f0ece4', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${photo.score}%`, background: `hsl(${20 + i*20}, 60%, ${55 + i*5}%)`, borderRadius: '3px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ STATS TAB ══ */}
          {activeSection === 'stats' && (
            <div className="fade-up">
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Évolution des métriques
              </p>

              {/* Score evolution */}
              <div className="card" style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Score global</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px', marginBottom: '10px' }}>
                  {PROGRESS_PHOTOS.map((photo, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{photo.score}</span>
                      <div style={{ width: '100%', background: i === PROGRESS_PHOTOS.length - 1 ? '#7bbf8c' : 'rgba(255,255,255,0.1)', borderRadius: '6px 6px 0 0', height: `${(photo.score / 100) * 60}px`, transition: 'height 1s ease', position: 'relative', overflow: 'hidden' }}>
                        {i === PROGRESS_PHOTOS.length - 1 && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #7bbf8c, #a8d5b0)' }} />}
                      </div>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{photo.date}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Progression totale</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7bbf8c' }}>+33 points (+73%)</span>
                </div>
              </div>

              {/* Metrics evolution */}
              {STATS_EVOLUTION.map((stat, i) => (
                <div key={i} className="card" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1714' }}>{stat.label}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#8c8278', textDecoration: 'line-through' }}>{stat.start}%</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: stat.color }}>{stat.current}%</span>
                      <span style={{ fontSize: '0.7rem', color: '#7bbf8c', fontWeight: 700 }}>
                        {stat.inverted ? `↓ -${stat.start - stat.current}%` : `↑ +${stat.current - stat.start}%`}
                      </span>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: '8px', background: '#f0ece4', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${stat.start}%`, background: '#d4cec7', borderRadius: '4px' }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${stat.current}%`, background: stat.color, borderRadius: '4px', transition: 'width 1.5s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#c4b5a5' }}>Début du programme</span>
                    <span style={{ fontSize: '0.65rem', color: '#c4b5a5' }}>Aujourd'hui</span>
                  </div>
                </div>
              ))}

              {/* Weekly consistency */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Constance par semaine
              </p>
              <div className="card">
                {[
                  { week: 'Semaine 1', pct: 71, days: '5/7 jours' },
                  { week: 'Semaine 2', pct: 86, days: '6/7 jours' },
                  { week: 'Semaine 3', pct: 100, days: '7/7 jours ⭐' },
                  { week: 'Semaine 4', pct: 67, days: '4/6 jours (en cours)' },
                ].map((w, i) => (
                  <div key={i} style={{ marginBottom: i < 3 ? '14px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1714' }}>{w.week}</span>
                      <span style={{ fontSize: '0.75rem', color: w.pct === 100 ? '#c9a96e' : '#8c8278', fontWeight: w.pct === 100 ? 700 : 400 }}>{w.days}</span>
                    </div>
                    <div style={{ height: '6px', background: '#f0ece4', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${w.pct}%`, background: w.pct === 100 ? 'linear-gradient(to right, #c9a96e, #e8c87a)' : '#7bbf8c', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ NOTES TAB ══ */}
          {activeSection === 'notes' && (
            <div className="fade-up">
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Journal de peau
              </p>

              {/* Add note button */}
              <button onClick={() => setShowNoteInput(!showNoteInput)}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px dashed rgba(232,133,106,0.3)', background: 'rgba(232,133,106,0.03)', color: '#e8856a', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', marginBottom: '14px', transition: 'all 0.2s' }}>
                + Ajouter une note aujourd'hui
              </button>

              {showNoteInput && (
                <div className="card" style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1a1714', marginBottom: '10px' }}>Note du jour · J.18</p>
                  <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                    placeholder="Comment s'est passée ta journée ? Ta peau a réagi comment ?"
                    style={{ width: '100%', minHeight: '100px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px', fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#1a1714', resize: 'none', outline: 'none', background: '#f9f7f4' }} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#1a1714', color: 'white', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                      Sauvegarder
                    </button>
                    <button onClick={() => setShowNoteInput(false)}
                      style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', color: '#8c8278', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Notes list */}
              {WEEKLY_NOTES.map((note, i) => (
                <div key={i} className="note-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{note.mood}</span>
                      <div>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1714' }}>Jour {note.date.replace('J.', '')} du programme</p>
                        <p style={{ fontSize: '0.65rem', color: '#c4b5a5' }}>Semaine {note.week}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#c4b5a5', background: 'white', padding: '3px 8px', borderRadius: '50px', border: '1px solid rgba(0,0,0,0.06)' }}>{note.date}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#1a1714', lineHeight: 1.6 }}>{note.note}</p>
                </div>
              ))}

              {/* Monthly summary */}
              <div style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)', borderRadius: '20px', padding: '20px', marginTop: '4px' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Résumé du mois</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '14px' }}>
                  "18 jours de programme. Ta peau a progressé de +33 points. Tu as maintenu une constance de 84%. Continue encore 12 jours pour la transformation finale."
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { label: 'Constance', value: '84%', color: '#7bbf8c' },
                    { label: 'Progression', value: '+73%', color: '#c9a96e' },
                    { label: 'Streak', value: '12j 🔥', color: '#e8856a' },
                  ].map((s, i) => (
                    <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
                      <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</p>
                      <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          {[
            { icon: '🏠', label: 'Accueil', active: false, action: () => router.push('/dashboard') },
            { icon: '📋', label: 'Routine', active: false, action: () => router.push('/routine') },
            { icon: '📸', label: 'Progrès', active: true, action: () => {} },
            { icon: '👤', label: 'Profil', active: false, action: () => {} },
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