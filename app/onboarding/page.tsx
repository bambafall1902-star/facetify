'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth'

const STEPS = [
  {
    id: 'skin_type',
    question: 'Quel est ton type de peau ?',
    options: [
      { value: 'oily', label: 'Grasse', emoji: '💧' },
      { value: 'dry', label: 'Sèche', emoji: '🏜️' },
      { value: 'combination', label: 'Mixte', emoji: '⚖️' },
      { value: 'sensitive', label: 'Sensible', emoji: '🌸' }
    ]
  },
  {
    id: 'acne_level',
    question: 'Comment décris-tu ton acné ?',
    options: [
      { value: 'mild', label: 'Légère', emoji: '🟡' },
      { value: 'moderate', label: 'Modérée', emoji: '🟠' },
      { value: 'severe', label: 'Sévère', emoji: '🔴' }
    ]
  },
  {
    id: 'stress_level',
    question: 'Quel est ton niveau de stress ?',
    options: [
      { value: 'low', label: 'Faible', emoji: '😌' },
      { value: 'medium', label: 'Moyen', emoji: '😐' },
      { value: 'high', label: 'Élevé', emoji: '😰' }
    ]
  },
  {
    id: 'sleep_quality',
    question: 'Comment tu dors en général ?',
    options: [
      { value: 'good', label: 'Bien', emoji: '😴' },
      { value: 'average', label: 'Moyen', emoji: '🥱' },
      { value: 'poor', label: 'Mal', emoji: '😵' }
    ]
  }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [STEPS[currentStep].id]: value }
    setAnswers(newAnswers)

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish(newAnswers)
    }
  }

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    // Crée le profil d'abord
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email
    })

    // Ensuite sauvegarde le profil peau
    await supabase.from('skin_profiles').upsert({
      user_id: user.id,
      skin_type: finalAnswers.skin_type,
      acne_level: finalAnswers.acne_level,
      stress_level: finalAnswers.stress_level
    })

    router.push('/dashboard')
  }

  const step = STEPS[currentStep]
  const progress = ((currentStep) / STEPS.length) * 100

  if (loading) return (
    <main style={{
      backgroundColor: '#0c0b09',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '1.2rem'
    }}>
      ✨ Création de ta routine...
    </main>
  )

  return (
    <main style={{
      backgroundColor: '#0c0b09',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      color: 'white',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Progress bar */}
        <div style={{
          height: '4px',
          background: '#1c1916',
          borderRadius: '2px',
          marginBottom: '48px'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#e8856a',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Step counter */}
        <p style={{ color: '#8a7e74', fontSize: '0.85rem', marginBottom: '12px' }}>
          Question {currentStep + 1} / {STEPS.length}
        </p>

        {/* Question */}
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: 'bold',
          marginBottom: '32px',
          lineHeight: '1.3'
        }}>
          {step.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {step.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                background: '#141210',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#e8856a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
            >
              <span style={{ fontSize: '1.5rem' }}>{option.emoji}</span>
              <span style={{ fontWeight: '500' }}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}