'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0907; color: #f0ebe4; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.3); } }

        .a1{animation:fadeUp 0.7s 0.1s ease both;}
        .a2{animation:fadeUp 0.7s 0.2s ease both;}
        .a3{animation:fadeUp 0.7s 0.3s ease both;}
        .a4{animation:fadeUp 0.7s 0.4s ease both;}
        .a5{animation:fadeUp 0.7s 0.5s ease both;}

        nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:20px 5%; display:flex; align-items:center; justify-content:space-between; background:rgba(10,9,7,0.9); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.05); }

        .nav-logo { font-family:'Bebas Neue',sans-serif; font-size:1.6rem; letter-spacing:0.04em; color:#f0ebe4; }
        .nav-logo span { color:#e8856a; }

        .btn-nav { background:#e8856a; color:#fff; padding:10px 24px; border-radius:4px; border:none; font-family:'DM Sans',sans-serif; font-weight:600; font-size:0.88rem; cursor:pointer; letter-spacing:0.02em; transition:all 0.2s; }
        .btn-nav:hover { background:#f0a088; transform:translateY(-1px); }

        .hero { min-height:100vh; display:flex; flex-direction:column; justify-content:flex-end; padding:0 5% 80px; position:relative; overflow:hidden; }

        .hero-bg { position:absolute; inset:0; background: radial-gradient(ellipse 60% 50% at 80% 20%, rgba(232,133,106,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(123,191,140,0.04) 0%, transparent 50%); pointer-events:none; }

        .hero-year { position:absolute; top:120px; right:5%; font-size:0.75rem; color:rgba(255,255,255,0.2); font-weight:500; letter-spacing:0.1em; text-transform:uppercase; writing-mode:vertical-rl; }

        .hero-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(5rem,14vw,14rem); line-height:0.9; letter-spacing:0.01em; color:#f0ebe4; margin-bottom:40px; }
        .hero-title span { color:#e8856a; display:block; }

        .hero-bottom { display:flex; align-items:flex-end; justify-content:space-between; gap:40px; flex-wrap:wrap; }

        .hero-desc { max-width:420px; font-size:1rem; color:rgba(255,255,255,0.45); line-height:1.7; font-weight:300; }

        .hero-cta-group { display:flex; flex-direction:column; align-items:flex-end; gap:12px; }

        .btn-primary { display:inline-flex; align-items:center; gap:10px; background:#e8856a; color:#fff; padding:16px 36px; border-radius:4px; font-family:'DM Sans',sans-serif; font-weight:600; font-size:1rem; border:none; cursor:pointer; transition:all 0.25s; letter-spacing:0.02em; }
        .btn-primary:hover { background:#f0a088; transform:translateY(-2px); box-shadow:0 12px 32px rgba(232,133,106,0.3); }

        .btn-outline { display:inline-flex; align-items:center; gap:8px; background:transparent; color:rgba(255,255,255,0.5); padding:14px 28px; border-radius:4px; font-family:'DM Sans',sans-serif; font-weight:500; font-size:0.9rem; border:1px solid rgba(255,255,255,0.1); cursor:pointer; transition:all 0.2s; }
        .btn-outline:hover { border-color:rgba(255,255,255,0.25); color:#f0ebe4; }

        .hero-trial { font-size:0.78rem; color:rgba(255,255,255,0.25); }
        .hero-trial span { color:#7bbf8c; font-weight:600; }

        .marquee-wrap { overflow:hidden; border-top:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06); padding:18px 0; background:rgba(255,255,255,0.02); }
        .marquee-track { display:flex; gap:0; animation:marquee 20s linear infinite; white-space:nowrap; }
        .marquee-item { display:inline-flex; align-items:center; gap:20px; padding:0 32px; font-size:0.78rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.2); }
        .marquee-dot { width:4px; height:4px; border-radius:50%; background:rgba(232,133,106,0.4); flex-shrink:0; }

        .section { padding:clamp(80px,10vw,140px) 5%; }
        .section-inner { max-width:1200px; margin:0 auto; }

        .section-num { font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(232,133,106,0.6); margin-bottom:16px; }

        h2.big { font-family:'Bebas Neue',sans-serif; font-size:clamp(3rem,7vw,7rem); line-height:0.95; letter-spacing:0.02em; color:#f0ebe4; margin-bottom:56px; }

        .steps-list { display:flex; flex-direction:column; gap:0; }
        .step-item { display:grid; grid-template-columns:80px 1fr auto; gap:32px; align-items:start; padding:32px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .step-item:last-child { border-bottom:none; }
        .step-num-big { font-family:'Bebas Neue',sans-serif; font-size:3.5rem; color:rgba(255,255,255,0.08); line-height:1; }
        .step-content h3 { font-size:1.1rem; font-weight:600; color:#f0ebe4; margin-bottom:8px; }
        .step-content p { font-size:0.88rem; color:rgba(255,255,255,0.4); line-height:1.7; max-width:480px; }
        .step-icon { font-size:2rem; opacity:0.7; }

        .benefits-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.06); }
        .benefit-item { background:#0a0907; padding:36px 32px; transition:background 0.2s; }
        .benefit-item:hover { background:rgba(255,255,255,0.02); }
        .benefit-icon { font-size:1.8rem; margin-bottom:20px; }
        .benefit-item h3 { font-size:1rem; font-weight:600; color:#f0ebe4; margin-bottom:10px; }
        .benefit-item p { font-size:0.85rem; color:rgba(255,255,255,0.4); line-height:1.65; }

        .testi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:16px; }
        .testi-item { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:32px; transition:border-color 0.2s; }
        .testi-item:hover { border-color:rgba(232,133,106,0.2); }
        .testi-quote-mark { font-family:'Bebas Neue',sans-serif; font-size:4rem; color:rgba(232,133,106,0.15); line-height:0.8; margin-bottom:0; }
        .testi-text { font-size:0.92rem; color:rgba(255,255,255,0.7); line-height:1.7; margin-bottom:24px; font-style:italic; font-weight:300; }
        .testi-author-name { font-weight:600; font-size:0.85rem; color:#f0ebe4; }
        .testi-author-meta { font-size:0.75rem; color:rgba(255,255,255,0.3); margin-top:2px; }
        .testi-badge { display:inline-flex; align-items:center; gap:4px; background:rgba(123,191,140,0.08); border:1px solid rgba(123,191,140,0.15); color:#7bbf8c; padding:3px 10px; border-radius:2px; font-size:0.7rem; font-weight:700; letter-spacing:0.06em; margin-left:auto; }

        .pricing-card { border:1px solid rgba(232,133,106,0.2); background:rgba(232,133,106,0.03); padding:clamp(40px,5vw,60px); max-width:600px; margin:0 auto; position:relative; }
        .pricing-card::before { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:200px; height:1px; background:linear-gradient(to right,transparent,rgba(232,133,106,0.5),transparent); }
        .price-big { font-family:'Bebas Neue',sans-serif; font-size:8rem; line-height:1; letter-spacing:-0.02em; color:#f0ebe4; }
        .price-sup { font-size:2.5rem; vertical-align:top; margin-top:16px; }
        .price-per { font-size:1rem; color:rgba(255,255,255,0.3); font-family:'DM Sans',sans-serif; font-weight:300; }
        .price-trial { color:#7bbf8c; font-weight:600; font-size:0.88rem; margin-top:8px; margin-bottom:40px; }
        .price-features { list-style:none; display:flex; flex-direction:column; gap:14px; margin-bottom:40px; text-align:left; }
        .price-features li { display:flex; align-items:center; gap:12px; font-size:0.9rem; color:rgba(255,255,255,0.7); }
        .pf-check { width:22px; height:22px; border-radius:2px; background:rgba(123,191,140,0.1); border:1px solid rgba(123,191,140,0.2); display:flex; align-items:center; justify-content:center; color:#7bbf8c; font-size:0.7rem; flex-shrink:0; }

        .faq-list { display:flex; flex-direction:column; max-width:800px; margin:0 auto; }
        .faq-item { border-bottom:1px solid rgba(255,255,255,0.06); }
        .faq-btn { width:100%; background:none; border:none; color:#f0ebe4; font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:500; text-align:left; padding:24px 0; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:16px; transition:color 0.2s; }
        .faq-btn:hover { color:#e8856a; }
        .faq-chevron { width:28px; height:28px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:0.8rem; color:rgba(255,255,255,0.3); transition:all 0.25s; flex-shrink:0; }
        .faq-item.open .faq-chevron { background:#e8856a; border-color:#e8856a; color:white; transform:rotate(180deg); }
        .faq-answer { max-height:0; overflow:hidden; transition:max-height 0.35s ease; }
        .faq-item.open .faq-answer { max-height:200px; }
        .faq-answer p { padding:0 0 24px; color:rgba(255,255,255,0.4); font-size:0.92rem; line-height:1.75; }

        .final-cta { text-align:center; padding:clamp(80px,10vw,140px) 5%; background:rgba(255,255,255,0.01); border-top:1px solid rgba(255,255,255,0.05); position:relative; overflow:hidden; }
        .final-cta::before { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:600px; height:300px; background:radial-gradient(ellipse,rgba(232,133,106,0.07) 0%,transparent 70%); pointer-events:none; }

        footer { padding:28px 5%; border-top:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; }
        .footer-logo { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:0.04em; color:#f0ebe4; }
        .footer-logo span { color:#e8856a; }
        .footer-links { display:flex; gap:24px; list-style:none; }
        .footer-links a { font-size:0.8rem; color:rgba(255,255,255,0.25); text-decoration:none; transition:color 0.2s; }
        .footer-links a:hover { color:rgba(255,255,255,0.6); }
        .footer-copy { font-size:0.78rem; color:rgba(255,255,255,0.15); }

        @media(max-width:640px) {
          .hero-title { font-size:clamp(4rem,18vw,8rem); }
          .hero-bottom { flex-direction:column; align-items:flex-start; }
          .hero-cta-group { align-items:flex-start; }
          .step-item { grid-template-columns:50px 1fr; }
          .step-icon { display:none; }
          nav .nav-links { display:none; }
        }
      `}</style>
      {/* NAV */}
      <nav>
        <div className="nav-logo">Face<span>tify</span></div>
        <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
          <a href="#how" style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.4)',textDecoration:'none',fontWeight:500}}>Comment</a>
          <a href="#pricing" style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.4)',textDecoration:'none',fontWeight:500}}>Tarifs</a>
          <button className="btn-nav" onClick={() => router.push('/login')}>Essai gratuit</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-year">2024 — Skincare</div>
        <div className="a1 hero-title">
          Peau<span>Nette</span>
        </div>
        <div className="hero-bottom">
          <div>
            <div className="a2" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(232,133,106,0.08)',border:'1px solid rgba(232,133,106,0.15)',color:'#e8856a',padding:'6px 16px',borderRadius:'2px',fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'20px'}}>
              <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#e8856a',animation:'pulse 2s infinite'}} />
              Routine IA personnalisée
            </div>
            <p className="a3 hero-desc">
              Débarrasse-toi de ton acné en 30 jours grâce à une routine skincare générée selon ton profil unique. Simple, efficace, sans te noyer dans les informations.
            </p>
          </div>
          <div className="hero-cta-group a4">
            <button className="btn-primary" onClick={() => router.push('/login')}>
              Commencer gratuitement →
            </button>
            <p className="hero-trial"><span>✓ 7 jours gratuits</span> · Sans carte bancaire</p>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_, j) => (
            ['Routine personnalisée','Acné réduite en 30 jours','Suivi photo','Streaks quotidiens','Peau nette','Badges & récompenses','Plan 30 jours','Rappels intelligents'].map((item, i) => (
              <span key={`${j}-${i}`} className="marquee-item">
                <span className="marquee-dot" />
                {item}
              </span>
            ))
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="section" style={{paddingTop:'80px',paddingBottom:'80px'}}>
        <div className="section-inner">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'40px'}}>
            {[
              {num:'2 800+',label:'Utilisateurs actifs'},
              {num:'★★★★★',label:'4.9/5 · 340 avis'},
              {num:'78%',label:'Résultats en 3 semaines'},
              {num:'30j',label:'Programme complet'},
            ].map((s,i) => (
              <div key={i}>
                <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'3.5rem',color:'#f0ebe4',lineHeight:1,letterSpacing:'0.02em'}}>{s.num}</p>
                <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.3)',fontWeight:500,marginTop:'6px',letterSpacing:'0.04em',textTransform:'uppercase'}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="section-inner">
          <p className="section-num">001 — Comment ça marche</p>
          <h2 className="big">4 ÉTAPES<br/>30 JOURS</h2>
          <div className="steps-list">
            {[
              {n:'01',icon:'🧪',title:'Diagnostic peau',desc:'8 questions sur ton type de peau, ton niveau d\'acné et tes habitudes de vie. 3 minutes max.'},
              {n:'02',icon:'✨',title:'Routine générée',desc:'Ta routine matin/soir personnalisée est prête immédiatement. Les bons produits dans le bon ordre.'},
              {n:'03',icon:'📅',title:'Suivi quotidien',desc:'Coche tes étapes chaque jour. Upload une photo par semaine. Reste motivé avec les streaks.'},
              {n:'04',icon:'🎯',title:'Résultats visibles',desc:'En 2–3 semaines ta peau commence à changer. En 30 jours la transformation est mesurable.'},
            ].map((step,i) => (
              <div key={i} className="step-item">
                <p className="step-num-big">{step.n}</p>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <span className="step-icon">{step.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* BENEFITS */}
      <section className="section" style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingBottom:'0'}}>
        <div className="section-inner">
          <p className="section-num">002 — Pourquoi Facetify</p>
          <h2 className="big">TOUT CE<br/>DONT TU<br/>AS BESOIN</h2>
        </div>
        <div className="benefits-grid">
          {[
            {icon:'🎯',title:'100% personnalisé',desc:'Pas de routine générique. Calculée selon ton type de peau, acné, stress, sommeil et alimentation.'},
            {icon:'📸',title:'Suivi photo',desc:'Upload une photo chaque semaine. Vois la progression réelle de ta peau côte à côte.'},
            {icon:'🔔',title:'Rappels intelligents',desc:'Notifications aux heures que tu choisis. Tu n\'oublieras plus jamais ta routine du soir.'},
            {icon:'🔥',title:'Streaks & Badges',desc:'Construis une habitude grâce aux streaks quotidiens. Plus c\'est régulier, plus c\'est efficace.'},
            {icon:'📱',title:'Mobile-first',desc:'Utilisable dans ta salle de bain depuis ton téléphone. Rapide, simple, sans friction.'},
            {icon:'💡',title:'Éducation incluse',desc:'Comprends pourquoi tu utilises chaque produit. Garde les bons réflexes à vie.'},
          ].map((b,i) => (
            <div key={i} className="benefit-item">
              <div className="benefit-icon">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="section-inner">
          <p className="section-num">003 — Témoignages</p>
          <h2 className="big">ILS ONT<br/>ESSAYÉ</h2>
          <div className="testi-grid">
            {[
              {text:"En 3 semaines mes boutons ont diminué de moitié. Je n'y croyais plus vraiment... et pourtant.",name:"Camille, 23 ans",meta:"Peau grasse · Acné modérée",day:"J.21"},
              {text:"Facetify m'a enfin expliqué pourquoi mes anciens produits n'allaient pas. Tout a changé.",name:"Théo, 20 ans",meta:"Peau mixte · Acné sévère",day:"J.30"},
              {text:"Simple, rapide, efficace. En 5 minutes j'avais ma routine complète. Le suivi photo est incroyable.",name:"Léa, 26 ans",meta:"Peau sensible · Acné légère",day:"J.18"},
            ].map((t,i) => (
              <div key={i} className="testi-item">
                <div className="testi-quote-mark">"</div>
                <p className="testi-text">{t.text}</p>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div style={{width:'36px',height:'36px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem'}}>👤</div>
                  <div style={{flex:1}}>
                    <p className="testi-author-name">{t.name}</p>
                    <p className="testi-author-meta">{t.meta}</p>
                  </div>
                  <div className="testi-badge">✓ {t.day}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="section-inner">
          <p className="section-num" style={{textAlign:'center'}}>004 — Tarifs</p>
          <h2 className="big" style={{textAlign:'center',marginBottom:'48px'}}>UN SEUL<br/>PLAN</h2>
          <div className="pricing-card">
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(232,133,106,0.08)',border:'1px solid rgba(232,133,106,0.15)',color:'#e8856a',padding:'6px 16px',fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'24px'}}>⚡ Offre de lancement</div>
            <div style={{textAlign:'center'}}>
              <div className="price-big"><sup className="price-sup">€</sup>10<span className="price-per">/mois</span></div>
              <p className="price-trial">✦ 7 jours gratuits — Sans carte requise</p>
            </div>
            <ul className="price-features">
              {['Diagnostic peau complet','Routine matin + soir personnalisée','Plan progressif 30 jours','Suivi photo hebdomadaire','Streaks & gamification','Rappels quotidiens','Résiliable à tout moment'].map((f,i) => (
                <li key={i}><span className="pf-check">✓</span>{f}</li>
              ))}
            </ul>
            <button className="btn-primary" style={{width:'100%',justifyContent:'center',fontSize:'1.05rem',padding:'18px'}} onClick={() => router.push('/login')}>
              Commencer mon essai gratuit →
            </button>
            <p style={{textAlign:'center',fontSize:'0.78rem',color:'rgba(255,255,255,0.2)',marginTop:'16px'}}>
              🔒 Satisfait ou remboursé 7 jours · Annulation en 1 clic
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="section-inner">
          <p className="section-num" style={{textAlign:'center'}}>005 — FAQ</p>
          <h2 className="big" style={{textAlign:'center',marginBottom:'56px'}}>QUESTIONS</h2>
          <div className="faq-list">
            {[
              {q:"Est-ce que ça marche vraiment en 30 jours ?",a:"78% de nos utilisateurs voient des résultats entre J.14 et J.21. En 30 jours la transformation est réelle. La régularité est la clé."},
              {q:"Je dois acheter de nouveaux produits ?",a:"Non. Facetify s'adapte à ce que tu as déjà. Les recommandations sont accessibles (moins de 15€ en pharmacie)."},
              {q:"L'essai gratuit nécessite une carte bancaire ?",a:"Non. 7 jours gratuits sans aucun moyen de paiement. Tu choisis ensuite si tu continues à 10€/mois."},
              {q:"Puis-je annuler à tout moment ?",a:"Oui. Annulation en 1 clic depuis ton dashboard. Pas de formulaire, pas de service client."},
              {q:"Ça marche pour l'acné sévère ?",a:"Facetify est optimisé pour l'acné légère à modérée. Pour l'acné sévère, consulte un dermatologue en parallèle."},
            ].map((item,i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <span className="faq-chevron">▾</span>
                </button>
                <div className="faq-answer"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <p style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(232,133,106,0.6)',marginBottom:'16px'}}>Prêt(e) ?</p>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(3.5rem,9vw,9rem)',lineHeight:0.9,letterSpacing:'0.02em',color:'#f0ebe4',marginBottom:'32px'}}>
          TA MEILLEURE<br/><span style={{color:'#e8856a'}}>PEAU</span>
        </h2>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'1rem',maxWidth:'400px',margin:'0 auto 40px',lineHeight:1.7}}>
          Rejoins 2 800+ personnes qui ont repris confiance en leur peau.
        </p>
        <button className="btn-primary" style={{fontSize:'1.05rem',padding:'18px 48px'}} onClick={() => router.push('/login')}>
          Démarrer mon essai gratuit →
        </button>
        <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.2)',marginTop:'16px'}}>
          <span style={{color:'rgba(123,191,140,0.7)',fontWeight:600}}>✓ Sans carte bancaire</span> · Résiliable à tout moment
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Face<span>tify</span></div>
        <ul className="footer-links">
          {['CGU','Confidentialité','Contact'].map(l => <li key={l}><a href="#">{l}</a></li>)}
        </ul>
        <p className="footer-copy">© 2024 Facetify</p>
      </footer>
    </>
  )
}