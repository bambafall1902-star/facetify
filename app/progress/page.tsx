'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

export default function ProgressPage() {
  const [user, setUser] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [checkins, setCheckins] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<'timeline' | 'stats' | 'notes'>('timeline')
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [newNote, setNewNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [newEmoji, setNewEmoji] = useState('😐')
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      // Charger la progression
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setUserProgress(progress)

      // Charger les photos
      const { data: photosData } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      setPhotos(photosData ?? [])

      // Charger les check-ins du mois
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0]
      const { data: checkinsData } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checkin_date', startOfMonth)
        .order('checkin_date', { ascending: true })
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
    const { data: progress } = await supabase
      .from('user_progress')
      .select('day_number')
      .eq('user_id', user.id)
      .single()

    await supabase.from('progress_photos').insert({
      user_id: user.id,
      photo_emoji: newEmoji,
      notes: newNote,
      skin_score: userProgress?.skin_score ?? 50,
      week_number: Math.ceil((progress?.day_number ?? 1) / 7),
      day_number: progress?.day_number ?? 1,
      photo_date: new Date().toISOString().split('T')[0]
    })

    setNewNote('')
    setShowNoteInput(false)

    // Recharger les photos
    const { data: photosData } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setPhotos(photosData ?? [])
  }

  if (loading) return (
    <div style={{ background: '#f5f2ed', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', color: '#8c8278' }}>
      Chargement de tes progrès...
    </div>
  )

  const dayNumber = userProgress?.day_number ?? 1
  const streak = userProgress?.streak_count ?? 0
  const skinScore = userProgress?.skin_score ?? 45
  const startScore = 45
  const progression = skinScore - startScore
  const consistencyDays = checkins.filter((c: any) => c.morning_done && c.evening_done).length
  const totalDays = checkins.length || 1
  const consistency = Math.round((consistencyDays / totalDays) * 100)

  // Calendrier du mois
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const calendarData = Array(daysInMonth).fill(null).map((_, i) => {
    const day = i + 1
    const dateStr = new Date(new Date().getFullYear(), new Date().getMonth(), day)
      .toISOString().split('T')[0]
    const checkin = checkins.find((c: any) => c.checkin_date === dateStr)
    if (!checkin) return null
    if (checkin.morning_done && checkin.evening_done) return true
    return false
  })

  const firstPhoto = photos[0]
  const lastPhoto = photos[photos.length - 1]
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2ed; font-family: 'DM Sans', sans-serif; color: #1a1714; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fillW { from{width:0} to{width:var(--w)} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .card { background: white; border-radius: 20px; padding: 20px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .tab-btn { flex: 1; padding: 11px 8px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-radius: 10px; transition: all 0.2s; color: #8c8278; }
        .tab-btn.active { background: white; color: #1a1714; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .photo-card { border-radius: 16px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; position: relative; }
        .photo-card.selected { border-color: #e8856a; box-shadow: 0 8px 24px rgba(232,133,106,0.2); }
        .photo-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .timeline-item { display: flex; gap: 14px; position: relative; margin-bottom: 20px; }
        .timeline-item::before { content: ''; position: absolute; left: 19px; top: 40px; bottom: -20px; width: 2px; background: rgba(0,0,0,0.06); }
        .timeline-item:last-child::before { display: none; }
        .timeline-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .note-card { background: #f9f7f4; border-radius: 14px; padding: 14px; border: 1px solid rgba(0,0,0,0.05); margin-bottom: 10px; }
        .slider-wrap { position: relative; border-radius: 16px; overflow: hidden; height: 200px; cursor: ew-resize; user-select: none; }
        .upload-zone { border: 2px dashed rgba(232,133,106,0.3); border-radius: 16px; padding: 28px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(232,133,106,0.02); }
        .upload-zone:hover { border-color: #e8856a; background: rgba(232,133,106,0.05); }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: white; border-top: 1px solid rgba(0,0,0,0.06); display: flex; z-index: 50; padding: 8px 0 16px; box-shadow: 0 -8px 32px rgba(0,0,0,0.06); }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 600; color: #c4b5a5; cursor: pointer; padding: 6px; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.04em; }
        .nav-item.active { color: #e8856a; }
        .nav-icon { font-size: 1.2rem; }
        .emoji-btn { padding: 8px 14px; border-radius: 10px; border: 2px solid transparent; background: #f5f2ed; cursor: pointer; font-size: 1.3rem; transition: all 0.2s; }
        .emoji-btn.selected { background: white; border-color: #e8856a; transform: scale(1.1); }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#f5f2ed', minHeight: '100vh', paddingBottom: '100px' }}>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(180deg, #1a1714, #2d2420)', padding: '20px 20px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(123,191,140,0.08)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans' }}>←</button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Facetify · Jour {dayNumber}</p>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>Mes Progrès</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{skinScore}</p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Skin Score</p>
            </div>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { label: 'Score initial', value: String(startScore), sub: 'Début' },
              { label: 'Score actuel', value: String(skinScore), sub: `+${progression} pts`, highlight: true },
              { label: 'Objectif', value: '90', sub: `Dans ${30 - dayNumber}j` },
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

              {/* Photos grid */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Photos de progression ({photos.length})
              </p>

              {photos.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📸</p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714', marginBottom: '6px' }}>Aucune photo encore</p>
                  <p style={{ fontSize: '0.82rem', color: '#8c8278' }}>Ajoute ta première photo pour voir ta progression</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  {photos.map((photo, i) => (
                    <div key={i} className={`photo-card ${selectedPhoto === i ? 'selected' : ''}`}
                      onClick={() => setSelectedPhoto(selectedPhoto === i ? null : i)}>
                      <div style={{ height: '120px', background: `linear-gradient(135deg, hsl(${20 + i*15}, 40%, ${50 + i*5}%), hsl(${30 + i*10}, 35%, ${40 + i*5}%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                        {photo.photo_emoji}
                      </div>
                      <div style={{ background: 'white', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a1714' }}>Jour {photo.day_number}</p>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7bbf8c', background: 'rgba(123,191,140,0.1)', padding: '2px 8px', borderRadius: '50px' }}>{photo.skin_score}</span>
                        </div>
                        <p style={{ fontSize: '0.65rem', color: '#8c8278', marginTop: '2px' }}>
                          {new Date(photo.photo_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                        {photo.notes && <p style={{ fontSize: '0.68rem', color: '#8c8278', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.notes}</p>}
                      </div>
                      {selectedPhoto === i && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px', background: '#e8856a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Avant/après slider */}
              {photos.length >= 2 && (
                <>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Avant / Après
                  </p>
                  <div className="card" style={{ padding: '16px' }}>
                    <div ref={sliderRef} className="slider-wrap" onMouseMove={handleSlider} onClick={handleSlider}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #c4a882, #8a6040)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '3rem' }}>{firstPhoto.photo_emoji}</p>
                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 14px', borderRadius: '50px', marginTop: '8px' }}>
                            <p style={{ fontSize: '0.72rem', color: 'white', fontWeight: 700 }}>Jour {firstPhoto.day_number} · Score {firstPhoto.skin_score}</p>
                          </div>
                        </div>
                      </div>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8c4a0, #d4a070)', clipPath: `inset(0 0 0 ${sliderPos}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', paddingLeft: `${Math.max(0, sliderPos - 20)}%` }}>
                          <p style={{ fontSize: '3rem' }}>{lastPhoto.photo_emoji}</p>
                          <div style={{ background: 'rgba(123,191,140,0.4)', padding: '4px 14px', borderRadius: '50px', marginTop: '8px' }}>
                            <p style={{ fontSize: '0.72rem', color: 'white', fontWeight: 700, whiteSpace: 'nowrap' }}>Jour {lastPhoto.day_number} · Score {lastPhoto.skin_score}</p>
                          </div>
                        </div>
                      </div>
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderPos}%`, width: '3px', background: 'white', boxShadow: '0 0 12px rgba(0,0,0,0.3)', transform: 'translateX(-50%)' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '36px', height: '36px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontWeight: 700, fontSize: '0.8rem' }}>↔</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#8c8278', textAlign: 'center', marginTop: '10px' }}>
                      Glisse pour comparer · +{progression} points de progression
                    </p>
                  </div>
                </>
              )}

              {/* Timeline */}
              {photos.length > 0 && (
                <>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Timeline
                  </p>
                  <div className="card">
                    {photos.map((photo, i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-dot" style={{ background: `hsl(${20 + i*20}, 60%, ${55 + i*5}%)` }}>
                          {photo.photo_emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1714' }}>Jour {photo.day_number}</p>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7bbf8c', background: 'rgba(123,191,140,0.1)', padding: '2px 8px', borderRadius: '50px' }}>Score {photo.skin_score}</span>
                          </div>
                          {photo.notes && <p style={{ fontSize: '0.82rem', color: '#8c8278', lineHeight: 1.5 }}>{photo.notes}</p>}
                          <p style={{ fontSize: '0.65rem', color: '#c4b5a5', marginTop: '4px' }}>
                            {new Date(photo.photo_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </p>
                          <div style={{ height: '4px', background: '#f0ece4', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
                            <div style={{ height: '100%', width: `${photo.skin_score}%`, background: `hsl(${20 + i*20}, 60%, ${55 + i*5}%)`, borderRadius: '2px' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ STATS TAB ══ */}
          {activeSection === 'stats' && (
            <div className="fade-up">
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Évolution réelle
              </p>

              {/* Score card */}
              <div className="card" style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)', color: 'white', marginBottom: '12px' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Score global</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px', marginBottom: '10px' }}>
                  {[startScore, ...photos.map((p: any) => p.skin_score), skinScore].slice(-4).map((score, i, arr) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{score}</span>
                      <div style={{ width: '100%', background: i === arr.length - 1 ? '#7bbf8c' : 'rgba(255,255,255,0.1)', borderRadius: '6px 6px 0 0', height: `${(score / 100) * 60}px` }}>
                        {i === arr.length - 1 && <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top, #7bbf8c, #a8d5b0)', borderRadius: '6px 6px 0 0' }} />}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Progression totale</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7bbf8c' }}>+{progression} points (+{Math.round((progression / startScore) * 100)}%)</span>
                </div>
              </div>

              {/* Stats réelles */}
              <div className="card">
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714', marginBottom: '14px' }}>Tes vraies statistiques</p>
                {[
                  { label: 'Jours de programme', value: `${dayNumber}/30`, pct: (dayNumber/30)*100, color: '#e8856a' },
                  { label: 'Streak actuel', value: `${streak} 🔥`, pct: (streak/30)*100, color: '#c9a96e' },
                  { label: 'Constance', value: `${consistency}%`, pct: consistency, color: '#7bbf8c' },
                  { label: 'Skin score', value: `${skinScore}/100`, pct: skinScore, color: '#b89dff' },
                ].map((s, i) => (
                  <div key={i} style={{ marginBottom: i < 3 ? '14px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1714' }}>{s.label}</span>
                      <span style={{ fontSize: '0.78rem', color: s.color, fontWeight: 700 }}>{s.value}</span>
                    </div>
                    <div style={{ height: '6px', background: '#f0ece4', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: '3px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Calendrier */}
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Calendrier du mois
              </p>
              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                  {['L','M','M','J','V','S','D'].map((d,i) => (
                    <div key={i} style={{ textAlign: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#c4b5a5', padding: '3px 0' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {calendarData.map((day, i) => (
                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, margin: '0 auto', background: day === true ? '#7bbf8c' : day === false ? '#f0ece4' : 'transparent', color: day === true ? 'white' : day === false ? '#c4b5a5' : '#d4cec7', border: day === null ? '1px dashed #e8e4df' : 'none' }}>
                      {day === true ? '✔' : day === false ? '○' : ''}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#8c8278' }}>✔ {calendarData.filter(d => d === true).length} jours complets</span>
                  <span style={{ fontSize: '0.72rem', color: '#8c8278' }}>○ {calendarData.filter(d => d === false).length} partiels</span>
                </div>
              </div>
            </div>
          )}

          {/* ══ NOTES TAB ══ */}
          {activeSection === 'notes' && (
            <div className="fade-up">
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Journal de peau
              </p>

              <button onClick={() => setShowNoteInput(!showNoteInput)}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px dashed rgba(232,133,106,0.3)', background: 'rgba(232,133,106,0.03)', color: '#e8856a', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', marginBottom: '14px' }}>
                + Ajouter une note aujourd'hui
              </button>

              {showNoteInput && (
                <div className="card" style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1a1714', marginBottom: '10px' }}>Note du jour · Jour {dayNumber}</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {['😊', '🙂', '😐', '😟', '😣'].map(emoji => (
                      <button key={emoji} className={`emoji-btn ${newEmoji === emoji ? 'selected' : ''}`}
                        onClick={() => setNewEmoji(emoji)}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                    placeholder="Comment s'est passée ta journée ? Ta peau a réagi comment ?"
                    style={{ width: '100%', minHeight: '100px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px', fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#1a1714', resize: 'none', outline: 'none', background: '#f9f7f4' }} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button onClick={saveNote}
                      style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#1a1714', color: 'white', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                      Sauvegarder
                    </button>
                    <button onClick={() => setShowNoteInput(false)}
                      style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', color: '#8c8278', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {photos.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                  <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📝</p>
                  <p style={{ fontSize: '0.88rem', color: '#8c8278' }}>Aucune note encore. Commence ton journal !</p>
                </div>
              ) : (
                photos.map((photo, i) => (
                  <div key={i} className="note-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{photo.photo_emoji}</span>
                        <div>
                          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1714' }}>Jour {photo.day_number}</p>
                          <p style={{ fontSize: '0.65rem', color: '#c4b5a5' }}>Semaine {photo.week_number}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', color: '#7bbf8c', background: 'rgba(123,191,140,0.1)', padding: '3px 8px', borderRadius: '50px', fontWeight: 700 }}>Score {photo.skin_score}</span>
                        <p style={{ fontSize: '0.62rem', color: '#c4b5a5', marginTop: '3px' }}>
                          {new Date(photo.photo_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    {photo.notes && <p style={{ fontSize: '0.85rem', color: '#1a1714', lineHeight: 1.6 }}>{photo.notes}</p>}
                  </div>
                ))
              )}

              {/* Résumé */}
              {photos.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)', borderRadius: '20px', padding: '20px', marginTop: '4px' }}>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Résumé</p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '14px' }}>
                    "{dayNumber} jours de programme. Ton skin score est passé de {startScore} à {skinScore}. {consistency}% de constance. Continue encore {30 - dayNumber} jours."
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { label: 'Constance', value: `${consistency}%`, color: '#7bbf8c' },
                      { label: 'Progression', value: `+${progression}`, color: '#c9a96e' },
                      { label: 'Streak', value: `${streak}🔥`, color: '#e8856a' },
                    ].map((s, i) => (
                      <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</p>
                        <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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