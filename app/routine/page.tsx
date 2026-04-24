'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const WEEKS = [
  {
    week: 1, title: 'Nettoyage', phase: 'Phase 1 — Purification', locked: false, color: '#7bbf8c',
    objective: ['Purifier les pores en profondeur', 'Éliminer l\'excès de sébum', 'Préparer la peau aux actifs'],
    focus: 'Cette semaine cible les impuretés et prépare ta peau à recevoir les actifs des semaines suivantes.',
    nextWeek: 'Semaine 2 : Traitement ciblé des boutons actifs',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant doux', product: 'CeraVe Mousse Nettoyante', duration: '60 sec', method: 'Mouvements circulaires doux. Eau tiède uniquement.', why: 'Élimine le sébum nocturne sans agresser la barrière cutanée.' },
      { step: 2, emoji: '💧', name: 'Hydratant léger', product: 'Neutrogena Hydro Boost Gel', duration: '20 sec', method: 'Une noisette. Tapoter, ne pas frotter.', why: 'Hydrate sans occlusion. Formule gel idéale pour peau à tendance acnéique.' },
      { step: 3, emoji: '☀️', name: 'SPF 50', product: 'La Roche-Posay Anthelios', duration: '30 sec', method: 'Dernière étape. Toujours, même nuageux.', why: 'Les UV aggravent l\'acné et les taches. Protection = anti-acné.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Eau micellaire', product: 'Bioderma Sensibio H2O', duration: '60 sec', method: 'Coton, sans frotter. Tamponner doucement.', why: 'Retire le SPF et la pollution. Première étape du double nettoyage.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant moussant', product: 'CeraVe Mousse Nettoyante', duration: '45 sec', method: 'Masse 45 secondes. Rincer à l\'eau froide.', why: 'Le double nettoyage = pores vraiment propres. Étape clé de la semaine.' },
      { step: 3, emoji: '🌙', name: 'Crème barrière', product: 'CeraVe Crème Hydratante', duration: '30 sec', method: 'Couche légère. Ta peau répare la nuit.', why: 'Les céramides reconstruisent ta barrière cutanée pendant le sommeil.' },
    ],
    special: [
      { day: 'Lundi', routine: 'Routine standard', icon: '📋' },
      { day: 'Mercredi', routine: 'Masque purifiant 10 min', icon: '🎭' },
      { day: 'Vendredi', routine: 'Exfoliation douce', icon: '✨' },
      { day: 'Dimanche', routine: 'Repos barrière cutanée', icon: '😌' },
    ],
    avoidTips: ['Ne touche pas ton visage avec les mains', 'Change ta taie d\'oreiller ce soir', 'Bois minimum 1.5L d\'eau aujourd\'hui', 'Ne saute surtout pas le SPF demain matin'],
  },
  {
    week: 2, title: 'Traitement', phase: 'Phase 1 — Actifs ciblés', locked: true, color: '#c9a96e',
    objective: ['Réduire les boutons actifs', 'Améliorer la texture', 'Stabiliser la production de sébum'],
    focus: 'Cette semaine introduit les actifs anti-acné. Ton teint va commencer à s\'unifier.',
    nextWeek: 'Semaine 3 : Réparation et cicatrisation',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant BHA', product: "Paula's Choice BHA Cleanser", duration: '60 sec', method: 'Laisser poser 30 sec avant rinçage.', why: 'Acide salicylique = exfoliant chimique anti-acné.' },
      { step: 2, emoji: '💊', name: 'Sérum BHA 2%', product: "Paula's Choice 2% BHA", duration: '30 sec', method: 'Coton sur zone T. Éviter contour yeux.', why: 'L\'actif le plus efficace contre l\'acné. Désincruste les pores.' },
      { step: 3, emoji: '💧', name: 'Hydratant oil-free', product: 'Bioderma Sébium Hydra', duration: '20 sec', method: 'Formule non comédogène certifiée.', why: 'Hydrate sans obstruer. Spécial peau acnéique.' },
      { step: 4, emoji: '☀️', name: 'SPF 50 mat', product: 'Altruist SPF50 Ultra Light', duration: '20 sec', method: 'Finish mat. Résiste à la transpiration.', why: 'SPF mat = parfait pour peaux grasses. Tient toute la journée.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Huile démaquillante', product: 'DHC Deep Cleansing Oil', duration: '90 sec', method: 'Masse 90 sec sur peau sèche avant d\'ajouter eau.', why: 'L\'huile dissout tout : SPF, sébum, pollution. Indispensable.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant actif', product: 'Effaclar Gel Moussant', duration: '45 sec', method: 'Le zinc régule le sébum. Double nettoyage complet.', why: 'Finit le travail de l\'huile. Pores parfaitement propres.' },
      { step: 3, emoji: '⚡', name: 'Niacinamide 10%', product: 'The Ordinary Niacinamide 10%', duration: '30 sec', method: 'Quelques gouttes. Tapoter sur tout le visage.', why: 'Régule le sébum, réduit les pores, efface les taches.' },
      { step: 4, emoji: '🌙', name: 'Crème légère nuit', product: 'Neutrogena Oil-Free Night', duration: '20 sec', method: 'Léger. Pas besoin de beaucoup.', why: 'Hydrate sans obstruer. Ta peau récupère la nuit.' },
    ],
    special: [
      { day: 'Lundi', routine: 'Routine standard', icon: '📋' },
      { day: 'Mercredi', routine: 'Masque argile 15 min', icon: '🎭' },
      { day: 'Vendredi', routine: 'BHA renforcé', icon: '⚡' },
      { day: 'Dimanche', routine: 'Soin réparateur', icon: '😌' },
    ],
    avoidTips: ['Évite le sucre cette semaine — inflammation directe', 'Nettoie ton téléphone chaque soir', 'Pas de nouveau produit cette semaine', 'Dors 8h minimum pour maximiser les résultats'],
  },
  {
    week: 3, title: 'Réparation', phase: 'Phase 2 — Cicatrisation', locked: true, color: '#e8856a',
    objective: ['Effacer les taches post-acné', 'Réparer la barrière cutanée', 'Uniformiser le teint'],
    focus: 'Introduction de la vitamine C et du rétinol. Ta peau va se transformer visiblement.',
    nextWeek: 'Semaine 4 : Glow et éclat final',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant doux', product: 'CeraVe Hydrating Cleanser', duration: '45 sec', method: 'Plus doux cette semaine. Les actifs ont purifié la peau.', why: 'Préserve la barrière fragilisée par les actifs précédents.' },
      { step: 2, emoji: '🍊', name: 'Vitamine C 10%', product: 'The Ordinary Ascorbic Acid 10%', duration: '30 sec', method: 'Matin uniquement. Attends 5 min avant hydratant.', why: 'Efface les taches post-acné et illumine le teint.' },
      { step: 3, emoji: '🛡️', name: 'Sérum cicatrisant', product: 'La Roche-Posay Cicaplast B5', duration: '20 sec', method: 'Calme les rougeurs. Apaise la peau.', why: 'Répare la barrière fragilisée. Calme l\'inflammation résiduelle.' },
      { step: 4, emoji: '💧', name: 'Crème céramides', product: 'CeraVe Crème Réparatrice', duration: '20 sec', method: 'Couche généreuse cette semaine.', why: 'Les céramides reconstruisent ta barrière lipidique.' },
      { step: 5, emoji: '☀️', name: 'SPF 50+ teinté', product: 'ISDIN Eryfotona Actinica', duration: '20 sec', method: 'Vit C + SPF = combo anti-taches parfait.', why: 'Protection maximale pour que la vitamine C agisse pleinement.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Baume démaquillant', product: 'Banila Co Clean It Zero', duration: '60 sec', method: 'Plus doux que l\'huile. Parfait pour la réparation.', why: 'Nettoie sans agresser la peau en phase de récupération.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant crème', product: 'Cetaphil Gentle Skin Cleanser', duration: '45 sec', method: 'Ultra-doux. Respecte la barrière réparée.', why: 'pH équilibré pour préparer la peau aux actifs du soir.' },
      { step: 3, emoji: '🔬', name: 'Rétinol 0.1%', product: 'The Ordinary Retinol 0.1%', duration: '30 sec', method: 'J3, J5, J7 seulement cette semaine. Progressif.', why: 'Accélère le renouvellement cellulaire. Efface les cicatrices.' },
      { step: 4, emoji: '🌙', name: 'Crème réparatrice', product: 'Avène Cicalfate+ Crème', duration: '20 sec', method: 'Couche généreuse. Cocon réparateur la nuit.', why: 'Répare et nourrit intensément pendant le sommeil.' },
    ],
    special: [
      { day: 'Lundi', routine: 'Vitamine C renforcée', icon: '🍊' },
      { day: 'Mercredi', routine: 'Masque hydratant 20 min', icon: '💧' },
      { day: 'Vendredi', routine: 'Rétinol + masque nuit', icon: '🔬' },
      { day: 'Dimanche', routine: 'Soin barrière intensif', icon: '🛡️' },
    ],
    avoidTips: ['Ne mélange pas vitamine C et rétinol', 'Utilise le rétinol UNIQUEMENT le soir', 'Écran solaire indispensable avec la vitamine C', 'Évite les gommages physiques cette semaine'],
  },
  {
    week: 4, title: 'Glow', phase: 'Phase 3 — Éclat final', locked: true, color: '#b89dff',
    objective: ['Révéler l\'éclat naturel', 'Lisser la texture définitivement', 'Consolider les résultats'],
    focus: 'La semaine finale. Tu vas voir la transformation complète. Ta peau n\'a jamais été aussi belle.',
    nextWeek: 'Mois 2 : Routine de maintenance personnalisée',
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant enzymatique', product: 'Dermalogica Daily Microfoliant', duration: '90 sec', method: 'Poudre enzymatique. Exfoliation douce quotidienne.', why: 'Élimine les cellules mortes pour maximiser l\'éclat.' },
      { step: 2, emoji: '🍊', name: 'Vitamine C 20%', product: 'SkinCeuticals C E Ferulic', duration: '30 sec', method: 'Version concentrée. La référence absolue.', why: 'Dose maximale pour illuminer et protéger.' },
      { step: 3, emoji: '✨', name: 'Sérum éclat', product: 'The Ordinary Alpha Arbutin 2%', duration: '20 sec', method: 'Efface les dernières taches.', why: 'Dépigmentant puissant. Résultat visible en 2 semaines.' },
      { step: 4, emoji: '💧', name: 'Crème soyeuse', product: 'Tatcha The Water Cream', duration: '20 sec', method: 'Texture unique. Teint porcelaine.', why: 'La récompense de 4 semaines d\'efforts. Éclat maximal.' },
      { step: 5, emoji: '☀️', name: 'SPF 50 + primer', product: 'Colorscience Sunforgettable SPF50', duration: '20 sec', method: 'Protection + apprêt en un seul geste.', why: 'Ta peau est prête. Protège-la pour conserver les résultats.' },
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Double démaquillage', product: 'Kose Softymo Speedy Oil', duration: '90 sec', method: 'Huile légère. Sans résidu.', why: 'Nettoyage parfait pour maximiser les actifs du soir.' },
      { step: 2, emoji: '🧼', name: 'Nettoyant peptides', product: 'COSRX Low pH Good Morning', duration: '45 sec', method: 'pH parfait pour actifs du soir.', why: 'Prépare la peau à recevoir les actifs les plus puissants.' },
      { step: 3, emoji: '⚡', name: 'Acide glycolique 7%', product: 'The Ordinary Glycolic Acid 7%', duration: '30 sec', method: '2 fois par semaine max. Évite contour yeux.', why: 'Révèle le Glow final. Exfoliant chimique puissant.' },
      { step: 4, emoji: '🔬', name: 'Rétinol 0.3%', product: 'The Ordinary Retinol 0.3%', duration: '20 sec', method: 'Version renforcée. Résultats spectaculaires.', why: 'Lissage et éclat maximum. Tu vois la différence.' },
      { step: 5, emoji: '🌙', name: 'Masque nuit', product: 'Laneige Water Sleeping Mask', duration: '0 sec', method: 'Dernière étape. Réveille-toi transformé(e).', why: 'La touche finale. Hydratation intense toute la nuit.' },
    ],
    special: [
      { day: 'Lundi', routine: 'Glow full routine', icon: '✨' },
      { day: 'Mercredi', routine: 'Acide glycolique + masque', icon: '⚡' },
      { day: 'Vendredi', routine: 'Rétinol 0.3% + sérum éclat', icon: '🔬' },
      { day: 'Dimanche', routine: 'Bilan + photos de transformation', icon: '📸' },
    ],
    avoidTips: ['Ne combine pas acide glycolique + rétinol la même nuit', 'SPF OBLIGATOIRE avec les acides', 'Photos de progrès dimanche — tu vas être surpris(e)', 'Note les produits qui ont le mieux marché'],
  }
]
export default function RoutinePage() {
  const [skinProfile, setSkinProfile] = useState<any>(null)
  const [activeWeek, setActiveWeek] = useState(0)
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [dayStatus, setDayStatus] = useState<'done' | 'partial' | 'skipped' | null>(null)
  const [skinFeeling, setSkinFeeling] = useState<number | null>(null)
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
    <div style={{ background: '#f5f2ed', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', color: '#8c8278' }}>
      Chargement de ta routine...
    </div>
  )

  const week = WEEKS[activeWeek]
  const steps = activeTab === 'morning' ? week.morning : week.evening

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2ed; font-family: 'DM Sans', sans-serif; color: #1a1714; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .fade-up { animation: fadeUp 0.4s ease both; }

        .week-tab { flex: 1; padding: 10px 6px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 700; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; color: rgba(255,255,255,0.3); letter-spacing: 0.04em; text-transform: uppercase; text-align: center; }
        .week-tab.active { color: white; border-bottom-color: #e8856a; }
        .week-tab.locked { opacity: 0.35; cursor: not-allowed; }

        .time-tab { flex: 1; padding: 13px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; border-radius: 10px; transition: all 0.2s; color: rgba(255,255,255,0.4); }
        .time-tab.active { background: rgba(255,255,255,0.1); color: white; }

        .step-card { background: white; border-radius: 16px; overflow: hidden; margin-bottom: 10px; border: 1px solid rgba(0,0,0,0.06); cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .step-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .step-card.expanded { border-color: rgba(232,133,106,0.3); }

        .objective-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .objective-item:last-child { border-bottom: none; }

        .special-day { background: white; border-radius: 14px; padding: 14px; border: 1px solid rgba(0,0,0,0.06); flex: 1; min-width: 140px; transition: transform 0.2s; }
        .special-day:hover { transform: translateY(-2px); }

        .avoid-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .avoid-item:last-child { border-bottom: none; }

        .status-btn { flex: 1; padding: 14px 10px; border-radius: 14px; border: 2px solid transparent; background: #f5f2ed; cursor: pointer; transition: all 0.2s; text-align: center; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; color: #8c8278; }
        .status-btn.selected-done { background: white; border-color: #7bbf8c; color: #7bbf8c; box-shadow: 0 4px 16px rgba(123,191,140,0.2); transform: scale(1.03); }
        .status-btn.selected-partial { background: white; border-color: #c9a96e; color: #c9a96e; box-shadow: 0 4px 16px rgba(201,169,110,0.2); transform: scale(1.03); }
        .status-btn.selected-skipped { background: white; border-color: #e8856a; color: #e8856a; box-shadow: 0 4px 16px rgba(232,133,106,0.2); transform: scale(1.03); }

        .feeling-btn { width: 64px; height: 64px; border-radius: 50%; border: 2px solid transparent; background: #f5f2ed; cursor: pointer; font-size: 1.8rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .feeling-btn.selected { background: white; border-color: #e8856a; box-shadow: 0 4px 16px rgba(232,133,106,0.2); transform: scale(1.1); }

        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: white; border-top: 1px solid rgba(0,0,0,0.06); display: flex; z-index: 50; padding: 8px 0 16px; box-shadow: 0 -8px 32px rgba(0,0,0,0.06); }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 600; color: #c4b5a5; cursor: pointer; padding: 6px; transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.04em; }
        .nav-item.active { color: #e8856a; }
        .nav-icon { font-size: 1.2rem; }

        .lock-blur { filter: blur(4px); pointer-events: none; }
      `}</style>

      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#f5f2ed', minHeight: '100vh', paddingBottom: '100px' }}>

        {/* ══ HEADER ══ */}
        <div style={{ background: 'linear-gradient(180deg, #1a1714 0%, #2d2420 100%)', padding: '20px 20px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: `${week.color}12` }} />

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'DM Sans' }}>←</button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{week.phase}</p>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Semaine {activeWeek + 1} — {week.title}
              </h1>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: `${week.color}20`, border: `1px solid ${week.color}40`, borderRadius: '50px', padding: '4px 10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: week.color, animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.65rem', color: week.color, fontWeight: 700 }}>{week.locked ? '🔒' : 'ACTIF'}</span>
            </div>
          </div>

          {/* Focus message */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px', borderLeft: `3px solid ${week.color}` }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
              "{week.focus}"
            </p>
          </div>

          {/* Week tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {WEEKS.map((w, i) => (
              <button key={i} className={`week-tab ${activeWeek === i ? 'active' : ''} ${w.locked ? 'locked' : ''}`}
                onClick={() => !w.locked && setActiveWeek(i)}>
                {w.locked ? '🔒' : `S${i+1}`}
                <div style={{ fontSize: '0.55rem', marginTop: '2px', fontWeight: 400, textTransform: 'none', opacity: 0.6 }}>{w.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>

        {/* ══ SECTION 2 — OBJECTIFS ══ */}
        <div style={{ margin: '16px 0 12px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Objectifs de la semaine</p>
          <div style={{ background: 'white', borderRadius: '20px', padding: '18px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {week.objective.map((obj, i) => (
              <div key={i} className="objective-item">
                <div style={{ width: '28px', height: '28px', background: `${week.color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.8rem', color: week.color }}>✓</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#1a1714', fontWeight: 500 }}>{obj}</p>
              </div>
            ))}
          </div>
        </div>
        {/* ══ SECTION 3/4 — ROUTINE MATIN/SOIR ══ */}
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Routine détaillée
        </p>

        {/* Time tabs */}
        <div style={{ background: '#1a1714', borderRadius: '14px', padding: '4px', display: 'flex', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button className={`time-tab ${activeTab === 'morning' ? 'active' : ''}`} onClick={() => { setActiveTab('morning'); setExpandedStep(null) }}>
            ☀️ Matin · {week.morning.length} étapes
          </button>
          <button className={`time-tab ${activeTab === 'evening' ? 'active' : ''}`} onClick={() => { setActiveTab('evening'); setExpandedStep(null) }}>
            🌙 Soir · {week.evening.length} étapes
          </button>
        </div>

        {/* Steps — locked overlay */}
        {week.locked ? (
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', minHeight: '280px' }}>
            <div className="lock-blur">
              {steps.slice(0, 2).map((step: any, i: number) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', background: '#f5f2ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{step.emoji}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{step.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#8c8278' }}>{step.product}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,242,237,0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '32px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2.5rem' }}>🔒</div>
              <div>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 600, color: '#1a1714', marginBottom: '8px' }}>
                  Semaine {activeWeek+1} verrouillée
                </p>
                <p style={{ fontSize: '0.82rem', color: '#8c8278', lineHeight: 1.6, maxWidth: '260px' }}>
                  Ta routine évolue chaque semaine selon tes progrès. Continue ton abonnement pour débloquer les {steps.length} étapes.
                </p>
              </div>
              <button onClick={async () => {
                const res = await fetch('/api/stripe/checkout', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }} style={{ background: '#1a1714', color: 'white', padding: '14px 32px', borderRadius: '50px', border: 'none', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(26,23,20,0.2)' }}>
                Débloquer → 10€/mois
              </button>
              <p style={{ fontSize: '0.72rem', color: '#c4b5a5' }}>Résiliable à tout moment</p>
            </div>
          </div>
        ) : (
          <div className="fade-up">
            {steps.map((step: any, i: number) => (
              <div key={i} className={`step-card ${expandedStep === i ? 'expanded' : ''}`} onClick={() => setExpandedStep(expandedStep === i ? null : i)}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: expandedStep === i ? `${week.color}15` : '#f5f2ed', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, transition: 'background 0.2s', border: expandedStep === i ? `1px solid ${week.color}30` : '1px solid transparent' }}>
                    {step.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.65rem', color: week.color, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Étape {step.step}</span>
                      <span style={{ fontSize: '0.65rem', color: '#c4b5a5', background: '#f5f2ed', padding: '1px 8px', borderRadius: '50px', fontWeight: 600 }}>{step.duration}</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1a1714', marginBottom: '2px' }}>{step.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#e8856a', fontWeight: 500 }}>{step.product}</p>
                  </div>
                  <span style={{ color: '#c4b5a5', fontSize: '1rem', transition: 'transform 0.25s', transform: expandedStep === i ? 'rotate(180deg)' : 'rotate(0deg)', display: 'block' }}>▾</span>
                </div>

                {expandedStep === i && (
                  <div style={{ padding: '0 16px 18px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1, background: '#f5f2ed', borderRadius: '12px', padding: '12px' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#c4b5a5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>🖐 Méthode</p>
                        <p style={{ fontSize: '0.82rem', color: '#1a1714', lineHeight: 1.55 }}>{step.method}</p>
                      </div>
                    </div>
                    <div style={{ background: `${week.color}10`, border: `1px solid ${week.color}25`, borderRadius: '12px', padding: '12px' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: week.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>💡 Pourquoi</p>
                      <p style={{ fontSize: '0.82rem', color: '#1a1714', lineHeight: 1.55 }}>{step.why}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ SECTION 5 — JOURS SPÉCIAUX ══ */}
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '20px 0 10px' }}>
          Jours spéciaux cette semaine
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {week.special.map((day, i) => (
            <div key={i} className="special-day" style={{ opacity: week.locked ? 0.5 : 1 }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{day.icon}</div>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1714', marginBottom: '3px' }}>{day.day}</p>
              <p style={{ fontSize: '0.72rem', color: '#8c8278', lineHeight: 1.4 }}>{day.routine}</p>
            </div>
          ))}
        </div>

        {/* ══ SECTION 6 — EVOLUTION HEBDO ══ */}
        <div style={{ background: 'linear-gradient(135deg, #1a1714, #2d2420)', borderRadius: '20px', padding: '20px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(232,133,106,0.08)' }} />
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Évolution automatique</p>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: 'white', fontWeight: 600, marginBottom: '8px', lineHeight: 1.4 }}>
            Ta routine s'adapte chaque semaine selon tes progrès
          </p>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '14px' }}>
            Régularité, photos, réactions skin — tout est analysé pour ajuster ta semaine suivante.
          </p>
          <div style={{ background: 'rgba(232,133,106,0.1)', border: '1px solid rgba(232,133,106,0.2)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>👉</span>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              Semaine prochaine : {week.nextWeek}
            </p>
          </div>
        </div>

        {/* ══ SECTION 7 — CONSEILS À ÉVITER ══ */}
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          À éviter cette semaine
        </p>
        <div style={{ background: 'white', borderRadius: '20px', padding: '18px', marginBottom: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {week.avoidTips.map((tip, i) => (
            <div key={i} className="avoid-item">
              <div style={{ width: '26px', height: '26px', background: 'rgba(232,133,106,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#e8856a', flexShrink: 0, fontWeight: 700 }}>✕</div>
              <p style={{ fontSize: '0.85rem', color: '#1a1714', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* ══ SECTION 8 — SUIVI DU JOUR ══ */}
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c4b5a5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Suivi du jour
        </p>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714', marginBottom: '14px' }}>Comment s'est passée ta routine ?</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[
              { label: '✅ Tout terminé', value: 'done' as const },
              { label: '⚡ En partie', value: 'partial' as const },
              { label: '❌ Sauté', value: 'skipped' as const },
            ].map((s, i) => (
              <button key={i} className={`status-btn ${dayStatus === s.value ? `selected-${s.value}` : ''}`}
                onClick={() => setDayStatus(s.value)}>
                {s.label}
              </button>
            ))}
          </div>

          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '0.95rem', fontWeight: 600, color: '#1a1714', marginBottom: '14px' }}>Comment se sent ta peau ?</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '16px' }}>
            {[{ emoji: '🙂', label: 'Bien' }, { emoji: '😐', label: 'Moyen' }, { emoji: '😣', label: 'Difficile' }].map((f, i) => (
              <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button className={`feeling-btn ${skinFeeling === i ? 'selected' : ''}`} onClick={() => setSkinFeeling(i)}>
                  {f.emoji}
                </button>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: skinFeeling === i ? '#e8856a' : '#c4b5a5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</span>
              </div>
            ))}
          </div>

          {(dayStatus || skinFeeling !== null) && (
            <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#1a1714', color: 'white', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Sauvegarder mon suivi →
            </button>
          )}
        </div>

        {/* ══ SECTION 9 — RÉCOMPENSES ══ */}
        <div style={{ background: 'linear-gradient(135deg, #c9a96e20, #e8c87a10)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(201,169,110,0.2)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '2rem', animation: 'pulse 2s infinite', display: 'inline-block' }}>🏆</div>
            <div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 600, color: '#1a1714', marginBottom: '2px' }}>
                Récompenses en jeu
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8c8278' }}>Complete 7 jours pour débloquer</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { emoji: '🥉', name: 'Bronze', req: '7 jours', unlocked: true },
              { emoji: '🥈', name: 'Argent', req: '21 jours', unlocked: false },
              { emoji: '🥇', name: 'Or', req: '30 jours', unlocked: false },
              { emoji: '💎', name: 'Diamant', req: '60 jours', unlocked: false },
            ].map((badge, i) => (
              <div key={i} style={{ flex: '1', minWidth: '70px', background: badge.unlocked ? 'white' : 'rgba(255,255,255,0.5)', borderRadius: '12px', padding: '10px', textAlign: 'center', border: badge.unlocked ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(0,0,0,0.06)', opacity: badge.unlocked ? 1 : 0.5, boxShadow: badge.unlocked ? '0 4px 12px rgba(201,169,110,0.15)' : 'none' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{badge.emoji}</div>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1a1714', marginBottom: '2px' }}>{badge.name}</p>
                <p style={{ fontSize: '0.6rem', color: '#8c8278' }}>{badge.req}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '14px', background: 'white', borderRadius: '12px', padding: '12px', border: '1px solid rgba(201,169,110,0.15)' }}>
            <p style={{ fontSize: '0.82rem', color: '#1a1714', fontFamily: 'Fraunces, serif', fontStyle: 'italic', textAlign: 'center' }}>
              "Excellent travail. Ta peau avance à grands pas." ✨
            </p>
          </div>
        </div>

        </div>{/* end padding div */}

        {/* ══ BOTTOM NAVIGATION ══ */}
        <div className="bottom-nav">
          {[
            { icon: '🏠', label: 'Accueil', active: false, action: () => router.push('/dashboard') },
            { icon: '📋', label: 'Routine', active: true, action: () => {} },
            { icon: '📸', label: 'Progrès', active: false, action: () => router.push('/progress') },
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