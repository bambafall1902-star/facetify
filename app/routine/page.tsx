'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const WEEKS = [
  {
    week: 1,
    title: 'Nettoyage',
    subtitle: 'Semaine 1 — Base',
    locked: false,
    color: '#7bbf8c',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant doux', product: 'CeraVe Mousse Nettoyante', duration: '60 sec', tip: 'Masse 45 sec en mouvements circulaires. Eau tiède surtout.' },
      { step: 2, emoji: '💧', name: 'Hydratant léger', product: 'Neutrogena Hydro Boost Gel', duration: '30 sec', tip: 'Une noisette suffit. Applique sur peau encore légèrement humide.' },
      { step: 3, emoji: '☀️', name: 'SPF 50', product: 'La Roche-Posay Anthelios', duration: '20 sec', tip: 'OBLIGATOIRE même nuageux. Le SPF est anti-acné car il protège des UV qui aggravent les taches.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Eau micellaire', product: 'Bioderma Sensibio H2O', duration: '60 sec', tip: 'Retire le SPF et la pollution. Ne pas frotter, tamponner doucement.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant mousse', product: 'CeraVe Mousse Nettoyante', duration: '45 sec', tip: 'Le double nettoyage = pores vraiment propres. Étape clé.' },
      { step: 3, emoji: '🌙', name: 'Crème nuit barrière', product: 'CeraVe Crème Hydratante', duration: '30 sec', tip: 'Ta peau se répare la nuit. Cette crème l\'aide à reconstruire sa barrière.' },
    ]
  },
  {
    week: 2,
    title: 'Traitement',
    subtitle: 'Semaine 2 — Actifs',
    locked: true,
    color: '#c9a96e',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant BHA', product: "Paula's Choice BHA Cleanser", duration: '60 sec', tip: 'Contient de l\'acide salicylique. Laisse poser 30 sec avant de rincer.' },
      { step: 2, emoji: '💊', name: 'Sérum BHA 2%', product: "Paula's Choice 2% BHA Liquid", duration: '30 sec', tip: 'L\'actif le plus efficace contre l\'acné. Applique avec un coton sur toute la zone T.' },
      { step: 3, emoji: '💧', name: 'Hydratant oil-free', product: 'Bioderma Sébium Hydra', duration: '20 sec', tip: 'Formule spéciale peau à tendance acnéique. Non comédogène certifié.' },
      { step: 4, emoji: '☀️', name: 'SPF 50 mat', product: 'Altruist SPF50 Ultra Light', duration: '20 sec', tip: 'Finish mat = parfait pour les peaux grasses. Tient toute la journée.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Démaquillant huile', product: 'DHC Deep Cleansing Oil', duration: '90 sec', tip: 'L\'huile dissout tout : SPF, sébum, pollution. Masse 90 secondes avant d\'ajouter de l\'eau.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant actif', product: 'Effaclar Gel Moussant', duration: '45 sec', tip: 'Contient du zinc qui régule le sébum. Le double nettoyage est obligatoire cette semaine.' },
      { step: 3, emoji: '⚡', name: 'Sérum Niacinamide', product: 'The Ordinary Niacinamide 10%', duration: '30 sec', tip: 'Réduit les pores, régule le sébum, efface les taches. Ton meilleur allié anti-acné.' },
      { step: 4, emoji: '🌙', name: 'Crème légère nuit', product: 'Neutrogena Oil-Free Night', duration: '20 sec', tip: 'Hydrate sans obstruer. Ta peau récupère pendant le sommeil.' },
    ]
  },
  {
    week: 3,
    title: 'Réparation',
    subtitle: 'Semaine 3 — Cicatrisation',
    locked: true,
    color: '#e8856a',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant doux', product: 'CeraVe Hydrating Cleanser', duration: '60 sec', tip: 'On passe à un nettoyant plus doux car les actifs de la S2 ont purifié la peau.' },
      { step: 2, emoji: '💊', name: 'Vitamine C 10%', product: 'The Ordinary Ascorbic Acid 10%', duration: '30 sec', tip: 'La vitamine C efface les taches post-acné et illumine le teint. Applique le matin uniquement.' },
      { step: 3, emoji: '🛡️', name: 'Sérum cicatrisant', product: 'La Roche-Posay Cicaplast B5', duration: '20 sec', tip: 'Répare la barrière cutanée fragilisée par les actifs. Calme les rougeurs résiduelles.' },
      { step: 4, emoji: '💧', name: 'Crème barrière', product: 'CeraVe Crème Réparatrice', duration: '20 sec', tip: 'Les céramides reconstituent ta barrière cutanée. Essentiel à cette étape.' },
      { step: 5, emoji: '☀️', name: 'SPF 50+ teinté', product: 'ISDIN Eryfotona Actinica', duration: '20 sec', tip: 'La vitamine C + SPF = combo anti-taches ultra-efficace. Ne jamais sauter.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Baume démaquillant', product: 'Banila Co Clean It Zero', duration: '90 sec', tip: 'Plus doux que l\'huile. Parfait pour la phase de réparation.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant crème', product: 'Cetaphil Gentle Skin Cleanser', duration: '45 sec', tip: 'Ultra-doux pour ne pas agresser la peau en réparation.' },
      { step: 3, emoji: '🔬', name: 'Rétinol 0.1%', product: 'The Ordinary Retinol 0.1%', duration: '30 sec', tip: 'Le rétinol accélère le renouvellement cellulaire. Commence doucement : J3, J5, J7 seulement.' },
      { step: 4, emoji: '🌙', name: 'Crème réparatrice riche', product: 'Avène Cicalfate+ Crème', duration: '20 sec', tip: 'Enveloppe la peau d\'un cocon réparateur pendant la nuit.' },
    ]
  },
  {
    week: 4,
    title: 'Glow',
    subtitle: 'Semaine 4 — Éclat final',
    locked: true,
    color: '#b89dff',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant enzymatique', product: 'Dermalogica Daily Microfoliant', duration: '90 sec', tip: 'Exfoliation douce enzymatique. Élimine les cellules mortes sans agresser.' },
      { step: 2, emoji: '💊', name: 'Vitamine C 20%', product: 'SkinCeuticals C E Ferulic', duration: '30 sec', tip: 'Version plus concentrée pour maximiser l\'éclat. La référence absolue en vitamine C.' },
      { step: 3, emoji: '✨', name: 'Sérum éclat', product: 'The Ordinary Alpha Arbutin 2%', duration: '20 sec', tip: 'Efface les dernières taches post-acné. Résultat visible en 2 semaines.' },
      { step: 4, emoji: '💧', name: 'Crème texture soyeuse', product: 'Tatcha The Water Cream', duration: '20 sec', tip: 'Texture unique qui donne un teint porcelaine. La récompense de 4 semaines d\'efforts.' },
      { step: 5, emoji: '🌟', name: 'Primer + SPF 50', product: 'Colorscience Sunforgettable SPF50', duration: '20 sec', tip: 'Protection + apprêt en un. Ta peau est maintenant prête à affronter la journée.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Double démaquillage', product: 'Kose Softymo Speedy Oil', duration: '90 sec', tip: 'Huile légère qui emporte tout sans résidu gras.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant peptides', product: 'COSRX Low pH Good Morning', duration: '45 sec', tip: 'pH équilibré pour préparer la peau aux actifs du soir.' },
      { step: 3, emoji: '⚡', name: 'Acide glycolique 7%', product: 'The Ordinary Glycolic Acid 7%', duration: '30 sec', tip: 'Exfoliant chimique qui révèle le Glow final. 2 fois par semaine maximum.' },
      { step: 4, emoji: '🔬', name: 'Rétinol 0.3%', product: 'The Ordinary Retinol 0.3%', duration: '20 sec', tip: 'Version renforcée du rétinol. Résultats spectaculaires sur le lissage et l\'éclat.' },
      { step: 5, emoji: '🌙', name: 'Masque nuit hydratant', product: 'Laneige Water Sleeping Mask', duration: '0 sec', tip: 'La touche finale. Tu te réveilles avec une peau transformée. Promis.' },
    ]
  }
]
export default function RoutinePage() {
  const [skinProfile, setSkinProfile] = useState<any>(null)
  const [activeWeek, setActiveWeek] = useState(0)
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning')
  const [loading, setLoading] = useState(true)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data } = await supabase.from('skin_profiles').select('*').eq('user_id', user.id).single()
      if (!data) return router.push('/onboarding')
      setSkinProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ background: '#0a0907', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>
      Chargement de ta routine...
    </div>
  )

  const currentWeek = WEEKS[activeWeek]
  const steps = currentWeek[activeTab]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0907; font-family: 'DM Sans', sans-serif; color: #f0ebe4; }

        .week-tab { flex: 1; padding: 10px 8px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; color: rgba(255,255,255,0.3); letter-spacing: 0.04em; text-transform: uppercase; }
        .week-tab.active { color: #f0ebe4; border-bottom-color: #e8856a; }
        .week-tab.locked { opacity: 0.4; cursor: not-allowed; }

        .time-tab { flex: 1; padding: 12px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; border-radius: 8px; transition: all 0.2s; color: rgba(255,255,255,0.4); }
        .time-tab.active { background: rgba(255,255,255,0.06); color: #f0ebe4; }

        .step-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; transition: border-color 0.2s; cursor: pointer; }
        .step-card:hover { border-color: rgba(255,255,255,0.12); }
        .step-card.expanded { border-color: rgba(232,133,106,0.3); }

        .lock-overlay { position: absolute; inset: 0; background: rgba(10,9,7,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; backdrop-filter: blur(4px); border-radius: 12px; z-index: 10; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div style={{ maxWidth: '520px', margin: '0 auto', minHeight: '100vh', background: '#0a0907', paddingBottom: '40px' }}>

        {/* HEADER */}
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            ←
          </button>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.04em', lineHeight: 1, color: '#f0ebe4' }}>
              MA ROUTINE
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
              Programme 30 jours · Peau {skinProfile?.skin_type === 'oily' ? 'grasse' : skinProfile?.skin_type === 'dry' ? 'sèche' : skinProfile?.skin_type === 'combination' ? 'mixte' : 'sensible'}
            </p>
          </div>
        </div>

        {/* WEEK TABS */}
        <div style={{ margin: '20px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex' }}>
          {WEEKS.map((w, i) => (
            <button
              key={i}
              className={`week-tab ${activeWeek === i ? 'active' : ''} ${w.locked ? 'locked' : ''}`}
              onClick={() => !w.locked && setActiveWeek(i)}
            >
              {w.locked ? '🔒' : `S${i + 1}`}
              <span style={{ display: 'block', fontSize: '0.6rem', marginTop: '2px', textTransform: 'none', fontWeight: 400 }}>{w.title}</span>
            </button>
          ))}
        </div>

        {/* WEEK INFO */}
        <div style={{ margin: '16px 20px 0', padding: '16px', background: `${currentWeek.color}10`, border: `1px solid ${currentWeek.color}25`, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentWeek.color, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: currentWeek.color }}>{currentWeek.subtitle}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
              {activeTab === 'morning' ? steps.length : currentWeek.evening.length} étapes · {activeTab === 'morning' ? 'Le matin' : 'Le soir'}
            </p>
          </div>
        </div>

        {/* TIME TABS */}
        <div style={{ margin: '12px 20px 0', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', display: 'flex', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button className={`time-tab ${activeTab === 'morning' ? 'active' : ''}`} onClick={() => setActiveTab('morning')}>
            ☀️ Matin
          </button>
          <button className={`time-tab ${activeTab === 'evening' ? 'active' : ''}`} onClick={() => setActiveTab('evening')}>
            🌙 Soir
          </button>
        </div>

        {/* STEPS */}
        <div className="fade-up" style={{ margin: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>

          {/* LOCK OVERLAY for locked weeks */}
          {currentWeek.locked && (
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', minHeight: '300px' }}>
              {/* Blurred preview */}
              <div style={{ filter: 'blur(3px)', pointerEvents: 'none' }}>
                {steps.slice(0, 2).map((step: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{step.emoji}</span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f0ebe4' }}>{step.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{step.product}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Lock message */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,9,7,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', backdropFilter: 'blur(4px)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem' }}>🔒</div>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.04em', color: '#f0ebe4', marginBottom: '8px' }}>
                    {currentWeek.subtitle} VERROUILLÉE
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '280px' }}>
                    Ta routine s'adapte chaque semaine. Continue ton abonnement pour débloquer les {steps.length} étapes de cette semaine.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
                    const data = await res.json()
                    if (data.url) window.location.href = data.url
                  }}
                  style={{ background: '#e8856a', color: 'white', padding: '14px 32px', borderRadius: '6px', border: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '8px' }}
                >
                  Débloquer → 10€/mois
                </button>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>7 jours gratuits · Sans engagement</p>
              </div>
            </div>
          )}

          {/* Unlocked steps */}
          {!currentWeek.locked && steps.map((step: any, i: number) => (
            <div
              key={i}
              className={`step-card ${expandedStep === i ? 'expanded' : ''}`}
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
            >
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  {step.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.7rem', color: currentWeek.color, fontWeight: 700, letterSpacing: '0.08em' }}>ÉTAPE {step.step}</span>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)', padding: '1px 6px', borderRadius: '3px' }}>{step.duration}</span>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f0ebe4' }}>{step.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{step.product}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: expandedStep === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
              </div>
              {expandedStep === i && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
                    💡 {step.tip}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div style={{ margin: '24px 20px 0' }}>
          <button onClick={() => router.push('/dashboard')} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', cursor: 'pointer' }}>
            ← Retour au dashboard
          </button>
        </div>

      </div>
    </>
  )
}