'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const ROUTINES: Record<string, any> = {
  oily: {
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant', product: 'CeraVe Mousse Nettoyante', tip: 'Masse 45 secondes, eau tiède' },
      { step: 2, emoji: '💊', name: 'Sérum BHA', product: "Paula's Choice 2% BHA", tip: 'Applique sur peau sèche' },
      { step: 3, emoji: '💧', name: 'Hydratant léger', product: 'Neutrogena Hydro Boost', tip: 'Petite quantité suffit' },
      { step: 4, emoji: '☀️', name: 'SPF 50', product: 'La Roche-Posay Anthelios', tip: 'Indispensable même nuageux !' }
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Démaquillant', product: 'Bioderma Micellar Water', tip: 'Retire bien le SPF' },
      { step: 2, emoji: '🧼', name: 'Nettoyant', product: 'CeraVe Mousse Nettoyante', tip: 'Double nettoyage = pores propres' },
      { step: 3, emoji: '✨', name: 'Sérum Niacinamide', product: 'The Ordinary Niacinamide 10%', tip: 'Régule le sébum' },
      { step: 4, emoji: '🌙', name: 'Crème nuit', product: 'CeraVe Hydratant Nuit', tip: 'Répare pendant le sommeil' }
    ]
  },
  dry: {
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant doux', product: 'Avène Eau Thermale', tip: 'Ne jamais frotter' },
      { step: 2, emoji: '💧', name: 'Sérum hydratant', product: 'Vichy Minéral 89', tip: 'Sur peau encore humide' },
      { step: 3, emoji: '🧴', name: 'Crème riche', product: 'Eucerin Sensitive', tip: 'Couche généreuse' },
      { step: 4, emoji: '☀️', name: 'SPF hydratant', product: 'Biore UV Aqua Rich', tip: 'Formule non desséchante' }
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Huile démaquillante', product: 'DHC Deep Cleansing Oil', tip: 'Masse doucement' },
      { step: 2, emoji: '🧼', name: 'Nettoyant crème', product: 'CeraVe Crème Lavante', tip: 'Préserve la barrière cutanée' },
      { step: 3, emoji: '✨', name: 'Sérum réparateur', product: 'The Inkey List Peptide', tip: 'Répare et nourrit' },
      { step: 4, emoji: '🌙', name: 'Baume nuit', product: 'Laneige Water Sleeping Mask', tip: 'Hydratation intense' }
    ]
  },
  combination: {
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant équilibrant', product: 'La Roche-Posay Effaclar', tip: 'Doux sur les joues' },
      { step: 2, emoji: '💊', name: 'Tonique BHA', product: 'COSRX BHA Blackhead Power', tip: 'Zone T seulement' },
      { step: 3, emoji: '💧', name: 'Gel hydratant', product: 'Belif True Cream Aqua Bomb', tip: 'Légèreté et hydratation' },
      { step: 4, emoji: '☀️', name: 'SPF 50', product: 'Altruist SPF50', tip: 'Finish mat parfait' }
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Eau micellaire', product: 'Garnier Micellar Water', tip: 'Premier nettoyage' },
      { step: 2, emoji: '🧼', name: 'Nettoyant moussant', product: 'Cetaphil Gentle Skin Cleanser', tip: 'Doux et efficace' },
      { step: 3, emoji: '✨', name: 'Sérum mixte', product: 'The Ordinary Niacinamide 5%', tip: 'Équilibre le sébum' },
      { step: 4, emoji: '🌙', name: 'Crème légère', product: 'Neutrogena Oil-Free', tip: 'Non comédogène' }
    ]
  },
  sensitive: {
    morning: [
      { step: 1, emoji: '🧼', name: 'Nettoyant ultra-doux', product: 'Avène Tolérance Extrême', tip: 'Eau froide uniquement' },
      { step: 2, emoji: '💧', name: 'Sérum apaisant', product: 'La Roche-Posay Cicaplast B5', tip: 'Calme les rougeurs' },
      { step: 3, emoji: '🧴', name: 'Crème barrière', product: 'CeraVe Crème Réparatrice', tip: 'Renforce la peau' },
      { step: 4, emoji: '☀️', name: 'SPF minéral', product: 'EltaMD UV Clear SPF46', tip: 'Sans irritants' }
    ],
    evening: [
      { step: 1, emoji: '🌊', name: 'Eau micellaire douce', product: 'Avène Eau Micellaire', tip: 'Sans rinçage possible' },
      { step: 2, emoji: '🧼', name: 'Nettoyant sans savon', product: 'Bioderma Atoderm', tip: 'Respecte le microbiome' },
      { step: 3, emoji: '✨', name: 'Sérum calmant', product: 'Dr. Jart+ Cicapair Serum', tip: 'Anti-rougeurs puissant' },
      { step: 4, emoji: '🌙', name: 'Crème apaisante', product: 'Avène Cicalfate+', tip: 'Répare la nuit' }
    ]
  }
}

export default function RoutinePage() {
  const [skinProfile, setSkinProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data } = await supabase
        .from('skin_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('skin profile data:', data)
if (!data) return router.push('/onboarding')
      setSkinProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{
      backgroundColor: '#0c0b09',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      ✨ Chargement de ta routine...
    </main>
  )

  const routine = ROUTINES[skinProfile?.skin_type] ?? ROUTINES['oily']
  const steps = routine[activeTab]

  return (
    <main style={{
      backgroundColor: '#0c0b09',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      color: 'white',
      padding: '24px',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', color: '#8a7e74', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Ma Routine</h1>
      </div>

      {/* Skin type badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(232,133,106,0.1)',
        border: '1px solid rgba(232,133,106,0.2)',
        borderRadius: '50px',
        padding: '6px 16px',
        fontSize: '0.85rem',
        color: '#e8856a',
        marginBottom: '24px'
      }}>
        ✨ Peau {skinProfile?.skin_type === 'oily' ? 'grasse' :
                 skinProfile?.skin_type === 'dry' ? 'sèche' :
                 skinProfile?.skin_type === 'combination' ? 'mixte' : 'sensible'}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: '#141210',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '24px'
      }}>
        {(['morning', 'evening'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab ? '#e8856a' : 'transparent',
              color: activeTab === tab ? 'white' : '#8a7e74',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'morning' ? '☀️ Matin' : '🌙 Soir'}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {steps.map((step: any) => (
          <div
            key={step.step}
            style={{
              background: '#141210',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{
                width: '36px',
                height: '36px',
                background: '#1c1916',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {step.emoji}
              </span>
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{step.name}</p>
                <p style={{ color: '#e8856a', fontSize: '0.8rem' }}>{step.product}</p>
              </div>
              <span style={{
                marginLeft: 'auto',
                background: '#1c1916',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: '#8a7e74'
              }}>
                {step.step}
              </span>
            </div>
            <p style={{
              color: '#8a7e74',
              fontSize: '0.82rem',
              paddingLeft: '48px'
            }}>
              💡 {step.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Back to dashboard */}
      <button
        onClick={() => router.push('/dashboard')}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'transparent',
          color: '#8a7e74',
          fontSize: '0.95rem',
          cursor: 'pointer',
          marginTop: '24px'
        }}
      >
        ← Retour au dashboard
      </button>
    </main>
  )
}