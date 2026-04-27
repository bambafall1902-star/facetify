'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

export default function ProgressPage() {
  const [user, setUser] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [checkins, setCheckins] = useState<any[]>([])
  const [newNote, setNewNote] = useState('')
  const [newEmoji, setNewEmoji] = useState('🙂')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [sliderPos, setSliderPos] = useState(50)
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      const { data: progress } = await supabase
        .from('user_progress').select('*').eq('user_id', user.id).single()
      setUserProgress(progress)

      const { data: photosData } = await supabase
        .from('progress_photos').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: true })
      setPhotos(photosData ?? [])

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0]
      const { data: checkinsData } = await supabase
        .from('daily_checkins').select('*').eq('user_id', user.id)
        .gte('checkin_date', startOfMonth).order('checkin_date', { ascending: true })
      setCheckins(checkinsData ?? [])

      setLoading(false)
    }
    load()
  }, [])

  const handleSlider = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setSliderPos(Math.max(5, Math.min(95, (x / rect.width) * 100)))
  }

  const saveNote = async () => {
    if (!user || !newNote.trim()) return
    await supabase.from('progress_photos').insert({
      user_id: user.id,
      photo_emoji: newEmoji,
      notes: newNote,
      skin_score: userProgress?.skin_score ?? 50,
      week_number: Math.ceil((userProgress?.day_number ?? 1) / 7),
      day_number: userProgress?.day_number ?? 1,
      photo_date: new Date().toISOString().split('T')[0]
    })
    setNewNote('')
    setShowNoteInput(false)
    const { data } = await supabase.from('progress_photos').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: true })
    setPhotos(data ?? [])
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf9', fontFamily: 'DM Sans, sans-serif', color: '#9b9189' }}>
      Chargement...
    </div>
  )

  const dayNumber = userProgress?.day_number ?? 1
  const streak = userProgress?.streak_count ?? 0
  const skinScore = userProgress?.skin_score ?? 45
  const startScore = 45
  const progression = skinScore - startScore
  const consistencyDays = checkins.filter((c: any) => c.morning_done && c.evening_done).length
  const consistency = checkins.length > 0 ? Math.round((consistencyDays / checkins.length) * 100) : 0
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const calendarData = Array(daysInMonth).fill(null).map((_, i) => {
    const dateStr = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1).toISOString().split('T')[0]
    const c = checkins.find((c: any) => c.checkin_date === dateStr)
    if (!c) return null
    return c.morning_done && c.evening_done
  })
  const firstName = user?.email?.split('@')[0]?.replace(/[0-9]/g, '')
  const displayName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : 'toi'
  const firstPhoto = photos[0]
  const lastPhoto = photos[photos.length - 1]
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fafaf9; font-family: 'DM Sans', sans-serif; color: #1a1714; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fillW { from{width:0%} to{width:var(--w)} }
        @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .section { padding: 40px 24px; border-bottom: 1px solid #f0ede8; }
        .section:last-child { border-bottom: none; }
        .section-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #c4b5a5; margin-bottom: 6px; }
        .section-title { font-family: 'Fraunces, serif'; font-size: 1.4rem; font-weight: 700; color: #1a1714; letter-spacing: -0.02em; margin-bottom: 4px; }
        .section-sub { font-size: 0.85rem; color: #9b9189; line-height: 1.6; }

        .notion-block { border-radius: 12px; border: 1px solid #f0ede8; background: white; margin-bottom: 10px; overflow: hidden; transition: box-shadow 0.2s; }
        .notion-block:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .stat-row { display: flex; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f7f5f2; }
        .stat-row:last-child { border-bottom: none; }
        .stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; margin-right: 14px; }
        .stat-label { flex: 1; font-size: 0.88rem; font-weight: 500; color: #1a1714; }
        .stat-value { font-size: 0.88rem; font-weight: 700; color: #1a1714; margin-right: 12px; }
        .stat-bar-track { width: 80px; height: 4px; background: #f0ede8; border-radius: 2px; overflow: hidden; }
        .stat-bar-fill { height: 100%; border-radius: 2px; animation: fillW 1.2s ease both; }

        .photo-entry { display: flex; gap: 16px; padding: 20px; border-bottom: 1px solid #f7f5f2; align-items: flex-start; }
        .photo-entry:last-child { border-bottom: none; }
        .photo-avatar { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
        .photo-content { flex: 1; }
        .photo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .photo-day { font-size: 0.85rem; font-weight: 700; color: #1a1714; }
        .photo-score { font-size: 0.72rem; font-weight: 700; padding: 2px 10px; border-radius: 50px; }
        .photo-date { font-size: 0.72rem; color: #c4b5a5; margin-bottom: 6px; }
        .photo-note { font-size: 0.85rem; color: #5a504a; line-height: 1.6; }
        .photo-bar { height: 3px; background: #f0ede8; border-radius: 2px; overflow: hidden; margin-top: 10px; }
        .photo-bar-fill { height: 100%; border-radius: 2px; }

        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .cal-header { font-size: 0.6rem; font-weight: 700; color: #c4b5a5; text-align: center; padding: 4px 0; text-transform: uppercase; }
        .cal-cell { aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 700; }

        .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; }

        .note-input { width: 100%; min-height: 80px; border: 1px solid #e8e4df; border-radius: 10px; padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: #1a1714; resize: none; outline: none; background: #fafaf9; transition: border-color 0.2s; }
        .note-input:focus { border-color: #c4b5a5; background: white; }

        .emoji-selector { display: flex; gap: 6px; margin-bottom: 12px; }
        .emoji-opt { width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #e8e4df; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: all 0.15s; }
        .emoji-opt:hover { border-color: #c4b5a5; transform: scale(1.05); }
        .emoji-opt.active { border-color: #1a1714; background: #1a1714; }

        .btn-primary { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px; border-radius: 12px; border: none; background: #1a1714; color: white; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #2d2420; transform: translateY(-1px); }
        .btn-ghost { display: flex; align-items: center; justify-content: center; padding: 12px 18px; border-radius: 10px; border: 1px solid #e8e4df; background: transparent; color: #9b9189; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #c4b5a5; color: #1a1714; }

        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: white; border-top: 1px solid #f0ede8; display: flex; z-index: 50; padding: 8px 0 16px; }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 0.6rem; font-weight: 700; color: #c4b5a5; cursor: pointer; padding: 6px; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.06em; }
        .nav-item.active { color: #1a1714; }
        .nav-icon { font-size: 1.2rem; }

        .slider-wrap { position: relative; border-radius: 14px; overflow: hidden; height: 180px; cursor: ew-resize; user-select: none; }
        .divider-line { position: absolute; top: 0; bottom: 0; width: 2px; background: white; box-shadow: 0 0 12px rgba(0,0,0,0.2); transform: translateX(-50%); }
        .divider-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 34px; height: 34px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

        .progress-ring { transform: rotate(-90deg); }

        @media(max-width: 480px) { .section { padding: 32px 20px; } }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fafaf9', minHeight: '100vh', paddingBottom: '80px' }}>

        {/* ── HEADER ── */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0ede8', paddingBottom: '20px', position: 'sticky', top: 0, background: 'rgba(250,250,249,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ width: '34px', height: '34px', border: '1px solid #e8e4df', borderRadius: '10px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#9b9189', flexShrink: 0, fontFamily: 'DM Sans' }}>←</button>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.65rem', color: '#c4b5a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Facetify · {displayName}</p>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 700, color: '#1a1714', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Mes Progrès</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 700, color: '#1a1714', lineHeight: 1 }}>{skinScore}</p>
            <p style={{ fontSize: '0.6rem', color: '#c4b5a5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skin Score</p>
          </div>
        </div>

        {/* ── SECTION 1 : RÉSUMÉ ── */}
        <div className="section" style={{ animation: 'fadeUp 0.5s ease both' }}>
          <div className="section-label">Résumé</div>
          <h2 className="section-title">Jour {dayNumber} sur 30</h2>
          <p className="section-sub">
            {progression > 0 ? `Ton skin score a progressé de +${progression} points depuis le début.` : `Ta transformation commence. Continue ta routine chaque jour.`}
          </p>

          {/* Big stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
            {[
              { value: `${dayNumber}`, label: 'Jours actifs', sub: '/30', color: '#e8856a', bg: 'rgba(232,133,106,0.06)' },
              { value: `${streak}`, label: 'Streak', sub: '🔥', color: '#c9a96e', bg: 'rgba(201,169,110,0.06)' },
              { value: `${consistency}%`, label: 'Constance', sub: '', color: '#7bbf8c', bg: 'rgba(123,191,140,0.06)' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: '14px', padding: '16px 12px', border: `1px solid ${s.color}20`, textAlign: 'center' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: `${s.color}80` }}>{s.sub}</span></p>
                <p style={{ fontSize: '0.65rem', color: '#9b9189', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Programme progress */}
          <div style={{ marginTop: '20px', background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #f0ede8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1714' }}>Programme 30 jours</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e8856a' }}>{Math.round((dayNumber/30)*100)}%</span>
            </div>
            <div style={{ height: '6px', background: '#f0ede8', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.round((dayNumber/30)*100)}%`, background: 'linear-gradient(to right, #e8856a, #f0a088)', borderRadius: '3px', transition: 'width 1.2s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {[
                { label: '🌱 Nettoyage', days: '1-10', active: dayNumber <= 10 },
                { label: '🔧 Réparation', days: '11-20', active: dayNumber > 10 && dayNumber <= 20 },
                { label: '✨ Glow', days: '21-30', active: dayNumber > 20 },
              ].map((p, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.62rem', fontWeight: p.active ? 700 : 400, color: p.active ? '#1a1714' : '#c4b5a5' }}>{p.label}</p>
                  <p style={{ fontSize: '0.58rem', color: '#c4b5a5', marginTop: '1px' }}>{p.days}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 2 : SKIN SCORE ── */}
        <div className="section">
          <div className="section-label">Skin Score</div>
          <h2 className="section-title">Évolution de ta peau</h2>

          <div className="notion-block" style={{ marginTop: '16px' }}>
            {[
              { icon: '💧', label: 'Score actuel', value: `${skinScore}/100`, pct: skinScore, color: '#7bbf8c', bg: 'rgba(123,191,140,0.1)' },
              { icon: '📈', label: 'Progression', value: `+${progression} pts`, pct: Math.min(100, (progression/55)*100), color: '#e8856a', bg: 'rgba(232,133,106,0.1)' },
              { icon: '🎯', label: 'Objectif', value: '90/100', pct: 90, color: '#b89dff', bg: 'rgba(184,157,255,0.1)' },
              { icon: '📅', label: 'Constance', value: `${consistency}%`, pct: consistency, color: '#c9a96e', bg: 'rgba(201,169,110,0.1)' },
            ].map((s, i) => (
              <div key={i} className="stat-row">
                <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <span className="stat-label">{s.label}</span>
                <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill" style={{ '--w': `${s.pct}%`, background: s.color } as any} />
                </div>
              </div>
            ))}
          </div>

          {/* Score chart */}
          {photos.length > 0 && (
            <div style={{ marginTop: '14px', background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #f0ede8' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9b9189', marginBottom: '14px' }}>Évolution du score</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
                {[{ score: startScore, label: 'Début' }, ...photos.map((p: any) => ({ score: p.skin_score, label: `J.${p.day_number}` })), { score: skinScore, label: 'Auj.' }].slice(-5).map((item, i, arr) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: i === arr.length - 1 ? '#7bbf8c' : '#9b9189' }}>{item.score}</span>
                    <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${(item.score / 100) * 50}px`, background: i === arr.length - 1 ? 'linear-gradient(to top, #7bbf8c, #a8d5b0)' : '#f0ede8' }} />
                    <span style={{ fontSize: '0.55rem', color: '#c4b5a5', fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 3 : CALENDRIER ── */}
        <div className="section">
          <div className="section-label">Calendrier</div>
          <h2 className="section-title">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
          <p className="section-sub">{calendarData.filter(d => d === true).length} jours complets · {calendarData.filter(d => d === false).length} partiels</p>

          <div style={{ marginTop: '16px', background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #f0ede8' }}>
            <div className="cal-grid" style={{ marginBottom: '8px' }}>
              {['L','M','M','J','V','S','D'].map((d,i) => (
                <div key={i} className="cal-header">{d}</div>
              ))}
            </div>
            <div className="cal-grid">
              {calendarData.map((day, i) => (
                <div key={i} className="cal-cell" style={{
                  background: day === true ? '#1a1714' : day === false ? '#f7f5f2' : 'transparent',
                  color: day === true ? 'white' : day === false ? '#c4b5a5' : '#e8e4df',
                  border: day === null ? '1px dashed #e8e4df' : 'none',
                  fontSize: day === true ? '0.7rem' : '0.6rem'
                }}>
                  {day === true ? '✓' : day === false ? '○' : ''}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { color: '#1a1714', label: 'Complet', count: calendarData.filter(d => d === true).length },
                { color: '#f0ede8', label: 'Partiel', count: calendarData.filter(d => d === false).length, textColor: '#c4b5a5' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                  <span style={{ fontSize: '0.72rem', color: '#9b9189' }}>{item.label} ({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── SECTION 4 : AVANT / APRÈS ── */}
        {photos.length >= 2 && (
          <div className="section">
            <div className="section-label">Comparaison</div>
            <h2 className="section-title">Avant / Après</h2>
            <p className="section-sub">Glisse le curseur pour comparer ta peau.</p>

            <div ref={sliderRef} className="slider-wrap" style={{ marginTop: '16px' }} onMouseMove={handleSlider} onClick={handleSlider}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #d4b896, #a08060)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '2.5rem' }}>{firstPhoto.photo_emoji}</p>
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '50px', padding: '3px 12px', marginTop: '6px', display: 'inline-block' }}>
                    <p style={{ fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>Jour {firstPhoto.day_number} · {firstPhoto.skin_score}</p>
                  </div>
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8d0b0, #c4a880)', clipPath: `inset(0 0 0 ${sliderPos}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', paddingLeft: `${Math.max(0, sliderPos - 15)}%` }}>
                  <p style={{ fontSize: '2.5rem' }}>{lastPhoto.photo_emoji}</p>
                  <div style={{ background: 'rgba(123,191,140,0.35)', borderRadius: '50px', padding: '3px 12px', marginTop: '6px', display: 'inline-block' }}>
                    <p style={{ fontSize: '0.7rem', color: 'white', fontWeight: 700, whiteSpace: 'nowrap' }}>Jour {lastPhoto.day_number} · {lastPhoto.skin_score}</p>
                  </div>
                </div>
              </div>
              <div className="divider-line" style={{ left: `${sliderPos}%` }}>
                <div className="divider-handle">↔</div>
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'white', borderRadius: '12px', border: '1px solid #f0ede8' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: '#c4b5a5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Début</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#1a1714' }}>{startScore}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: '#c4b5a5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Progression</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#7bbf8c' }}>+{progression}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: '#c4b5a5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Aujourd'hui</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: '#1a1714' }}>{skinScore}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 5 : TIMELINE ── */}
        <div className="section">
          <div className="section-label">Timeline</div>
          <h2 className="section-title">Historique de tes entrées</h2>
          <p className="section-sub">{photos.length} entrées enregistrées</p>

          <div className="notion-block" style={{ marginTop: '16px' }}>
            {photos.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '10px' }}>📝</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714', marginBottom: '4px' }}>Aucune entrée encore</p>
                <p style={{ fontSize: '0.82rem', color: '#9b9189' }}>Ajoute ta première note ci-dessous</p>
              </div>
            ) : (
              photos.map((photo, i) => (
                <div key={i} className="photo-entry">
                  <div className="photo-avatar" style={{ background: `hsl(${25 + i*15}, 40%, ${88 - i*3}%)` }}>
                    {photo.photo_emoji}
                  </div>
                  <div className="photo-content">
                    <div className="photo-header">
                      <span className="photo-day">Jour {photo.day_number} — Semaine {photo.week_number}</span>
                      <span className="photo-score" style={{ background: `hsl(${120 + (photo.skin_score - 45) * 2}, 40%, 95%)`, color: `hsl(${120 + (photo.skin_score - 45) * 2}, 50%, 35%)` }}>
                        Score {photo.skin_score}
                      </span>
                    </div>
                    <p className="photo-date">
                      {new Date(photo.photo_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    {photo.notes && <p className="photo-note">{photo.notes}</p>}
                    <div className="photo-bar">
                      <div className="photo-bar-fill" style={{ width: `${photo.skin_score}%`, background: `hsl(${120 + (photo.skin_score - 45) * 2}, 50%, 65%)` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── SECTION 6 : AJOUTER UNE NOTE ── */}
        <div className="section">
          <div className="section-label">Journal</div>
          <h2 className="section-title">Note du jour</h2>
          <p className="section-sub">Comment est ta peau aujourd'hui ? Note-le pour suivre tes progrès.</p>

          {!showNoteInput ? (
            <button onClick={() => setShowNoteInput(true)} className="btn-primary" style={{ marginTop: '16px' }}>
              + Ajouter une entrée
            </button>
          ) : (
            <div style={{ marginTop: '16px', background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #e8e4df' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9b9189', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Comment te sens-tu ?</p>
              <div className="emoji-selector">
                {['😊', '🙂', '😐', '😟', '😣'].map(emoji => (
                  <button key={emoji} className={`emoji-opt ${newEmoji === emoji ? 'active' : ''}`}
                    onClick={() => setNewEmoji(emoji)}
                    style={{ filter: newEmoji === emoji ? 'brightness(0) invert(1)' : 'none' }}>
                    {emoji}
                  </button>
                ))}
              </div>
              <textarea className="note-input" value={newNote} onChange={e => setNewNote(e.target.value)}
                placeholder="Ta peau a réagi comment aujourd'hui ? Quelque chose à noter ?" />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={saveNote} className="btn-primary" style={{ flex: 1 }}>
                  Sauvegarder
                </button>
                <button onClick={() => setShowNoteInput(false)} className="btn-ghost">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 7 : INSIGHT ── */}
        <div className="section">
          <div className="section-label">Insight</div>
          <h2 className="section-title">Ce que dit ton programme</h2>

          <div style={{ background: '#1a1714', borderRadius: '16px', padding: '24px', marginTop: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(232,133,106,0.08)' }} />
            <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '20px' }}>
              "{dayNumber} jours de programme. {progression > 0 ? `Ton skin score a augmenté de +${progression} points.` : 'Ta transformation commence.'} {consistency > 80 ? 'Ta constance est excellente.' : `Tu as maintenu ${consistency}% de constance.`} {30 - dayNumber > 0 ? `Continue encore ${30 - dayNumber} jours pour voir la transformation finale.` : 'Tu as complété le programme !'}"
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { label: 'Constance', value: `${consistency}%`, color: '#7bbf8c' },
                { label: 'Progression', value: `+${progression}`, color: '#c9a96e' },
                { label: 'Streak', value: `${streak} 🔥`, color: '#e8856a' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{s.value}</p>
                  <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          {[
            { icon: '🏠', label: 'Accueil', active: false, action: () => router.push('/dashboard') },
            { icon: '📋', label: 'Routine', active: false, action: () => router.push('/routine') },
            { icon: '📸', label: 'Progrès', active: true, action: () => {} },
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