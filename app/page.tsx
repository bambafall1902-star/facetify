'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    reveals.forEach(el => observer.observe(el))

    // FAQ toggle
    const faqBtns = document.querySelectorAll('.faq-question')
    faqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item')
        const isOpen = item?.classList.contains('open')
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'))
        if (!isOpen) item?.classList.add('open')
      })
    })

    // Navbar scroll
    const nav = document.querySelector('nav')
    const handleScroll = () => {
      if (nav) {
        if (window.scrollY > 60) {
          nav.style.background = 'rgba(12,11,9,0.95)'
          nav.style.backdropFilter = 'blur(12px)'
          nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)'
        } else {
          nav.style.background = ''
          nav.style.backdropFilter = 'blur(8px)'
          nav.style.borderBottom = ''
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0c0b09; --surface: #141210; --surface2: #1c1916;
          --border: rgba(255,255,255,0.07); --coral: #e8856a; --coral-light: #f0a088;
          --cream: #f5ede3; --cream-dim: #c4b5a5; --text: #f0ebe4;
          --text-muted: #8a7e74; --gold: #c9a96e; --green: #7bbf8c;
          --radius: 16px; --radius-lg: 28px;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.6; overflow-x: hidden; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 18px 5%; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to bottom, rgba(12,11,9,0.95) 0%, transparent 100%); backdrop-filter: blur(8px); }
        .logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--cream); letter-spacing: -0.02em; }
        .logo span { color: var(--coral); }
        .nav-links { display: flex; gap: 2rem; list-style: none; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: var(--cream); }
        .btn-nav { background: var(--coral); color: #fff !important; padding: 9px 22px; border-radius: 50px; font-weight: 600 !important; font-size: 0.88rem !important; transition: all 0.2s !important; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }
        .btn-nav:hover { background: var(--coral-light) !important; transform: translateY(-1px); }
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 5% 80px; position: relative; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 20%, rgba(232,133,106,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 70%, rgba(123,191,140,0.06) 0%, transparent 50%); pointer-events: none; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(232,133,106,0.12); border: 1px solid rgba(232,133,106,0.25); color: var(--coral-light); padding: 7px 18px; border-radius: 50px; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 28px; animation: fadeUp 0.6s ease both; }
        .badge-dot { width: 6px; height: 6px; background: var(--coral); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.8rem,7vw,5.5rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; color: var(--cream); max-width: 820px; animation: fadeUp 0.7s 0.1s ease both; }
        .hero h1 em { font-style: italic; color: var(--coral); }
        .hero-sub { font-size: clamp(1rem,2vw,1.2rem); color: var(--text-muted); max-width: 500px; margin: 24px auto 0; font-weight: 400; line-height: 1.7; animation: fadeUp 0.7s 0.2s ease both; }
        .hero-cta { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-top: 40px; animation: fadeUp 0.7s 0.3s ease both; }
        .btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--coral); color: #fff; text-decoration: none; padding: 16px 34px; border-radius: 50px; font-weight: 600; font-size: 1rem; transition: all 0.25s; box-shadow: 0 8px 32px rgba(232,133,106,0.35); border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover { background: var(--coral-light); transform: translateY(-2px); box-shadow: 0 14px 40px rgba(232,133,106,0.45); }
        .btn-secondary { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: var(--cream-dim); text-decoration: none; padding: 16px 28px; border-radius: 50px; font-weight: 500; font-size: 1rem; border: 1px solid var(--border); transition: all 0.2s; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.15); color: var(--cream); transform: translateY(-1px); }
        .hero-guarantee { margin-top: 20px; font-size: 0.82rem; color: var(--text-muted); animation: fadeUp 0.7s 0.4s ease both; }
        .hero-guarantee span { color: var(--green); font-weight: 600; }
        .social-bar { padding: 24px 5%; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: center; gap: clamp(24px,4vw,64px); flex-wrap: wrap; }
        .stat-item { text-align: center; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: var(--cream); }
        .stat-label { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; margin-top: 2px; }
        .stars { color: var(--gold); font-size: 1rem; letter-spacing: 2px; }
        section { padding: clamp(60px,8vw,100px) 5%; }
        .section-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--coral); margin-bottom: 14px; }
        h2 { font-family: 'Playfair Display', serif; font-size: clamp(2rem,4.5vw,3.2rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--cream); }
        .pain-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 16px; }
        .pain-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
        .pain-card:hover { border-color: rgba(232,133,106,0.2); transform: translateY(-2px); }
        .pain-card::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: linear-gradient(to bottom, var(--coral), transparent); }
        .pain-icon { font-size: 1.8rem; margin-bottom: 14px; }
        .pain-card h3 { font-size: 1rem; font-weight: 600; color: var(--cream); margin-bottom: 8px; }
        .pain-card p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
        .solution { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .solution-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .check-list { list-style: none; margin-top: 32px; display: flex; flex-direction: column; gap: 14px; }
        .check-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 0.95rem; color: var(--text); }
        .check-icon { width: 22px; height: 22px; background: rgba(123,191,140,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--green); font-size: 0.7rem; flex-shrink: 0; margin-top: 1px; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 20px; }
        .step-card { text-align: center; padding: 36px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); transition: border-color 0.2s, transform 0.2s; }
        .step-card:hover { border-color: rgba(232,133,106,0.2); transform: translateY(-4px); }
        .step-num { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; color: rgba(232,133,106,0.1); line-height: 1; margin-bottom: 14px; }
        .step-icon { font-size: 2rem; margin-bottom: 16px; }
        .step-card h3 { font-size: 1.05rem; font-weight: 600; color: var(--cream); margin-bottom: 10px; }
        .step-card p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.65; }
        .benefits { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 20px; }
        .benefit-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; transition: border-color 0.2s, transform 0.2s; }
        .benefit-card:hover { border-color: rgba(232,133,106,0.2); transform: translateY(-3px); }
        .benefit-icon-wrap { width: 52px; height: 52px; background: rgba(232,133,106,0.1); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 20px; }
        .benefit-card h3 { font-size: 1.05rem; font-weight: 600; color: var(--cream); margin-bottom: 10px; }
        .benefit-card p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.65; }
        .testi-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; }
        .testi-quote { font-size: 3rem; font-family: 'Playfair Display', serif; color: rgba(232,133,106,0.2); line-height: 1; margin-bottom: -12px; }
        .testi-text { font-size: 0.95rem; color: var(--text); line-height: 1.7; margin-bottom: 24px; }
        .testi-name { font-weight: 600; font-size: 0.9rem; color: var(--cream); }
        .testi-meta { font-size: 0.78rem; color: var(--text-muted); }
        .testi-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(123,191,140,0.1); border: 1px solid rgba(123,191,140,0.2); color: var(--green); padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; margin-left: auto; }
        .pricing { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .pricing-card { background: var(--bg); border: 1px solid rgba(232,133,106,0.3); border-radius: 32px; padding: 52px; max-width: 560px; margin: 0 auto; text-align: center; position: relative; overflow: hidden; box-shadow: 0 0 80px rgba(232,133,106,0.08); }
        .pricing-card::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 200px; height: 1px; background: linear-gradient(to right, transparent, var(--coral), transparent); }
        .pricing-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(232,133,106,0.12); border: 1px solid rgba(232,133,106,0.25); color: var(--coral-light); padding: 6px 16px; border-radius: 50px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 28px; }
        .price-amount { font-family: 'Playfair Display', serif; font-size: 5rem; font-weight: 900; color: var(--cream); line-height: 1; letter-spacing: -0.04em; }
        .price-trial { margin-top: 10px; font-size: 0.85rem; color: var(--green); font-weight: 600; }
        .price-features { list-style: none; margin: 36px 0; text-align: left; display: flex; flex-direction: column; gap: 14px; }
        .price-features li { display: flex; align-items: center; gap: 12px; font-size: 0.92rem; color: var(--text); }
        .pf-icon { width: 24px; height: 24px; background: rgba(123,191,140,0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--green); font-size: 0.75rem; flex-shrink: 0; }
        .pricing-guarantee { margin-top: 20px; font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 6px; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-question { width: 100%; background: none; border: none; color: var(--cream); font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; text-align: left; padding: 22px 0; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: color 0.2s; }
        .faq-question:hover { color: var(--coral-light); }
        .faq-chevron { width: 28px; height: 28px; border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--text-muted); flex-shrink: 0; transition: all 0.25s; }
        .faq-item.open .faq-chevron { background: var(--coral); border-color: var(--coral); color: #fff; transform: rotate(180deg); }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-answer p { padding: 0 0 22px; color: var(--text-muted); font-size: 0.93rem; line-height: 1.7; }
        .faq-item.open .faq-answer { max-height: 200px; }
        .final-cta { text-align: center; background: var(--surface); border-top: 1px solid var(--border); position: relative; overflow: hidden; }
        .final-cta-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 50% 100%, rgba(232,133,106,0.1) 0%, transparent 60%); pointer-events: none; }
        footer { padding: 32px 5%; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-links { display: flex; gap: 24px; list-style: none; }
        .footer-links a { font-size: 0.83rem; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--cream); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: none; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 20px; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar { width: 42px; height: 42px; border-radius: 50%; font-size: 1.2rem; background: var(--surface2); display: flex; align-items: center; justify-content: center; border: 2px solid var(--border); }
        @media(max-width:768px) { .nav-links{display:none;} .solution-inner{grid-template-columns:1fr;gap:48px;} .pricing-card{padding:36px 28px;} }
      `}</style>
      {/* NAV */}
      <nav>
        <div className="logo">Face<span>tify</span></div>
        <ul className="nav-links">
          <li><a href="#how">Comment ça marche</a></li>
          <li><a href="#benefits">Bénéfices</a></li>
          <li><a href="#pricing">Tarifs</a></li>
          <li><button className="btn-nav" onClick={() => router.push('/login')}>Commencer gratuitement</button></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-badge"><span className="badge-dot" />Routine IA personnalisée</div>
        <h1>Débarrasse-toi de ton acné<br />en <em>30 jours</em></h1>
        <p className="hero-sub">Une routine skincare personnalisée selon ta peau. Simple, efficace, et sans te noyer dans un océan de produits.</p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => router.push('/login')}>Commencer gratuitement →</button>
          <a href="#how" className="btn-secondary">▶ Voir comment ça marche</a>
        </div>
        <p className="hero-guarantee"><span>✓ 7 jours gratuits</span> — Sans carte bancaire requise</p>
      </section>

      {/* SOCIAL PROOF */}
      <div className="social-bar">
        <div className="stat-item"><div className="stat-num">2 800+</div><div className="stat-label">Utilisateurs actifs</div></div>
        <div className="stat-item"><div className="stars">★★★★★</div><div className="stat-label">4.9/5 · 340 avis</div></div>
        <div className="stat-item"><div className="stat-num">78%</div><div className="stat-label">Résultats en 3 semaines</div></div>
        <div className="stat-item"><div className="stat-num">30 jours</div><div className="stat-label">Pour une vraie transformation</div></div>
      </div>

      {/* PROBLEM */}
      <section>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',maxWidth:'680px',margin:'0 auto 60px'}} className="reveal">
            <div className="section-label">Le problème</div>
            <h2>Tu en as marre de chercher partout sans résultat ?</h2>
            <p style={{marginTop:'18px',color:'var(--text-muted)',fontSize:'1.05rem',lineHeight:'1.7'}}>Des milliers de produits. Des conseils contradictoires. Des routines trop complexes. Et pourtant ton acné est toujours là.</p>
          </div>
          <div className="pain-grid">
            {[
              {icon:'😵‍💫',title:'Trop d\'informations',desc:'YouTube, TikTok, Reddit... tout le monde donne un avis différent. Tu ne sais plus quoi croire.'},
              {icon:'💸',title:'De l\'argent gaspillé',desc:'Tu achètes des produits qui ne marchent pas sur ta peau. Chaque nouvelle "solution miracle" déçoit.'},
              {icon:'🔁',title:'Aucune régularité',desc:'Tu commences une routine, tu l\'oublies au bout de 3 jours. Sans suivi, impossible de voir des résultats.'},
              {icon:'😔',title:'La confiance en soi qui baisse',desc:'L\'acné, c\'est visible. Ça affecte ta façon d\'interagir avec les autres au quotidien.'},
              {icon:'🤷',title:'Pas adapté à TON type de peau',desc:'Une routine qui marche pour quelqu\'un d\'autre n\'est pas forcément faite pour toi.'},
              {icon:'⏳',title:'Aucun suivi dans le temps',desc:'Sans tracker tes progrès, tu ne vois pas l\'évolution. Et sans résultats, tu abandonnes.'},
            ].map((p,i) => (
              <div key={i} className="pain-card reveal">
                <div className="pain-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',maxWidth:'560px',margin:'0 auto 64px'}} className="reveal">
            <div className="section-label">Comment ça marche</div>
            <h2>De l'inscription aux résultats en 4 étapes</h2>
          </div>
          <div className="steps-grid">
            {[
              {n:'01',icon:'🧪',title:'Diagnostic peau',desc:'Réponds à 8 questions sur ton type de peau, ton acné et tes habitudes. L\'algorithme fait le reste.'},
              {n:'02',icon:'✨',title:'Routine générée',desc:'Reçois immédiatement ta routine matin/soir sur 30 jours, avec les bons produits dans le bon ordre.'},
              {n:'03',icon:'📅',title:'Suivi quotidien',desc:'Coche tes étapes chaque jour. Upload une photo par semaine pour voir l\'évolution de ta peau.'},
              {n:'04',icon:'🎯',title:'Résultats visibles',desc:'En 2–3 semaines, ta peau commence à changer. En 30 jours, la transformation est réelle et mesurable.'},
            ].map((s,i) => (
              <div key={i} className="step-card reveal">
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits" id="benefits">
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',maxWidth:'600px',margin:'0 auto 60px'}} className="reveal">
            <div className="section-label">Pourquoi Facetify</div>
            <h2>Tout ce dont tu as besoin, rien de plus</h2>
          </div>
          <div className="benefits-grid">
            {[
              {icon:'🎯',title:'100% personnalisé',desc:'Pas de copier-coller générique. Ta routine est calculée selon ton profil unique.'},
              {icon:'📸',title:'Suivi photo intégré',desc:'Upload une photo chaque semaine. Vois la progression réelle de ta peau côte à côte.'},
              {icon:'🔔',title:'Rappels intelligents',desc:'Des notifications aux heures que tu choisis. Tu n\'oublieras plus jamais ta routine du soir.'},
              {icon:'🔥',title:'Streaks & Gamification',desc:'Construis une habitude grâce aux streaks, badges et récompenses.'},
              {icon:'📱',title:'Mobile-first',desc:'Utilisable directement depuis ton téléphone, dans la salle de bain, en 2 secondes.'},
              {icon:'💡',title:'Éducation incluse',desc:'Comprends pourquoi tu utilises chaque produit. Garde les bons réflexes à vie.'},
            ].map((b,i) => (
              <div key={i} className="benefit-card reveal">
                <div className="benefit-icon-wrap">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'56px'}} className="reveal">
            <div className="section-label">Ils ont essayé</div>
            <h2>Des vraies peaux, de vrais résultats</h2>
          </div>
          <div className="testimonials-grid">
            {[
              {text:"En 3 semaines mes boutons ont diminué de moitié. Je n'y croyais plus vraiment... et pourtant.",name:"Camille, 23 ans",meta:"Peau grasse · Acné modérée",day:"J.21"},
              {text:"Facetify m'a enfin expliqué pourquoi mes anciens produits n'allaient pas pour ma peau. Tout a changé.",name:"Théo, 20 ans",meta:"Peau mixte · Acné sévère",day:"J.30"},
              {text:"Simple, rapide, efficace. En 5 minutes j'avais ma routine complète. Le suivi photo est incroyable.",name:"Léa, 26 ans",meta:"Peau sensible · Acné légère",day:"J.18"},
            ].map((t,i) => (
              <div key={i} className="testi-card reveal">
                <div className="testi-quote">"</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">👤</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-meta">{t.meta}</div>
                  </div>
                  <div className="testi-badge">✓ {t.day}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <div style={{textAlign:'center',maxWidth:'560px',margin:'0 auto 56px'}} className="reveal">
            <div className="section-label">Tarifs</div>
            <h2>Un seul plan. Tout inclus.</h2>
            <p style={{marginTop:'16px',color:'var(--text-muted)'}}>Moins cher qu'un seul produit en pharmacie.</p>
          </div>
          <div className="pricing-card reveal">
            <div className="pricing-tag">⚡ Offre de lancement</div>
            <div className="price-amount"><sup style={{fontSize:'2rem',verticalAlign:'top',marginTop:'14px'}}>€</sup>10<span style={{fontSize:'1.2rem',fontWeight:300,color:'var(--text-muted)'}}>/mois</span></div>
            <div className="price-trial">✦ Sans carte requise pour démarrer</div>
            <ul className="price-features">
              {['Diagnostic peau complet','Routine matin + soir personnalisée','Plan progressif sur 30 jours','Suivi photo hebdomadaire','Streaks & gamification','Rappels quotidiens','Résiliable à tout moment'].map((f,i) => (
                <li key={i}><span className="pf-icon">✓</span>{f}</li>
              ))}
            </ul>
            <button className="btn-primary" style={{width:'100%',justifyContent:'center',fontSize:'1.05rem',padding:'18px'}} onClick={() => router.push('/login')}>
              Commencer maintenant →
            </button>
            <div className="pricing-guarantee">🔒 Annulation en 1 clic · Satisfait ou remboursé</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div style={{maxWidth:'720px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'52px'}} className="reveal">
            <div className="section-label">FAQ</div>
            <h2>Questions fréquentes</h2>
          </div>
          {[
            {q:"Est-ce que ça marche vraiment en 30 jours ?",a:"78% de nos utilisateurs voient des résultats entre J.14 et J.21. En 30 jours la transformation est réelle. La régularité est la clé."},
            {q:"Je dois acheter de nouveaux produits ?",a:"Non. Facetify s'adapte à ce que tu as déjà. Les recommandations sont accessibles en pharmacie (moins de 15€)."},
            {q:"L'essai gratuit nécessite une carte bancaire ?",a:"Non. Tu peux démarrer sans aucun moyen de paiement. Tu choisis ensuite si tu continues à 10€/mois."},
            {q:"Puis-je annuler à tout moment ?",a:"Oui. Annulation en 1 clic depuis ton dashboard. Pas de formulaire, pas de service client."},
            {q:"Ça marche pour l'acné sévère ?",a:"Facetify est optimisé pour l'acné légère à modérée. Pour l'acné sévère, consulte un dermatologue en parallèle."},
          ].map((item,i) => (
            <div key={i} className="faq-item">
              <button className="faq-question">
                {item.q}
                <span className="faq-chevron">▾</span>
              </button>
              <div className="faq-answer"><p>{item.a}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="final-cta-bg" />
        <div className="section-label" style={{textAlign:'center'}}>Prêt(e) ?</div>
        <h2 style={{fontSize:'clamp(2rem,5vw,3.6rem)',maxWidth:'720px',margin:'0 auto 20px'}} className="reveal">
          Ta meilleure peau commence <em style={{color:'var(--coral)',fontStyle:'italic'}}>aujourd'hui</em>
        </h2>
        <p style={{color:'var(--text-muted)',fontSize:'1.05rem',maxWidth:'480px',margin:'0 auto 40px'}} className="reveal">
          Rejoins 2 800+ personnes qui ont repris confiance en leur peau.
        </p>
        <button className="btn-primary reveal" style={{fontSize:'1.1rem',padding:'18px 44px'}} onClick={() => router.push('/login')}>
          Démarrer maintenant →
        </button>
        <p className="hero-guarantee reveal" style={{marginTop:'18px'}}>
          <span>✓ Sans carte bancaire</span> · <span style={{color:'var(--green)',fontWeight:600}}>✓ Résiliable à tout moment</span>
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="logo">Face<span>tify</span></div>
        <ul className="footer-links">
          <li><a href="#">CGU</a></li>
          <li><a href="#">Confidentialité</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <p style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>© 2024 Facetify</p>
      </footer>
    </>
  )
}