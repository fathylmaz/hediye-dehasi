import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Brain, Check, CheckCircle2,
  ChevronLeft, ChevronRight, CircleHelp, Database, ExternalLink, Heart,
  Lightbulb, Menu, Moon, RotateCcw, Search, Shield, ShieldAlert, SlidersHorizontal,
  Sparkles, Star, Target, WandSparkles, X
} from 'lucide-react'
import { api } from './api'
import type { Goal, Interest, Meta, Page, Preferences, Product, RankedProduct, RankingMode, RecommendationResponse } from './types'

type View = 'home' | 'catalog' | 'method'
const GOALS: { key: Goal; label: string; description: string; symbol: string }[] = [
  { key: 'cognitive', label: 'Bilişsel', description: 'Öğrenme ve problem çözme', symbol: '🧩' },
  { key: 'physical', label: 'Fiziksel', description: 'Hareket ve motor beceriler', symbol: '🏃' },
  { key: 'social', label: 'Sosyal', description: 'Paylaşma ve iletişim', symbol: '🤝' },
  { key: 'emotional', label: 'Duygusal', description: 'Duyguları tanıma', symbol: '💗' },
]
const INTERESTS: { key: Interest; label: string; symbol: string }[] = [
  { key: 'science', label: 'Bilim & STEM', symbol: '🔬' },
  { key: 'art', label: 'Sanat & yaratıcılık', symbol: '🎨' },
  { key: 'sports', label: 'Spor', symbol: '⚽' },
  { key: 'music', label: 'Müzik', symbol: '🎵' },
  { key: 'nature', label: 'Doğa', symbol: '🌱' },
  { key: 'logic', label: 'Mantık', symbol: '♟️' },
  { key: 'social', label: 'Sosyal oyun', symbol: '🎲' },
  { key: 'language', label: 'Dil', symbol: '📚' },
  { key: 'sensory', label: 'Duyusal', symbol: '🧸' },
]
const METRICS: Record<string, string> = {
  cognitive: 'Bilişsel', physical: 'Fiziksel', social: 'Sosyal', emotional: 'Duygusal',
  safety: 'Kaynak güvenlik puanı', quietness: 'Sessizlik', technology: 'Teknoloji yoğunluğu',
  open_ended: 'Açık uçluluk', educational: 'Öğreticilik', durability: 'Dayanıklılık',
  difficulty: 'Zorluk', season: 'Mevsim', space: 'Alan', sustainability: 'Sürdürülebilirlik',
  battery_proxy: 'Pil (kaynak puanı)', material_proxy: 'Malzeme (kaynak puanı)',
  budget_proxy: 'Bütçe (kaynak puanı)', parent_involvement: 'Ebeveyn katılımı', language: 'Dil',
}
const EVIDENCE_TEXT = { full: 'Geniş alan kapsamı', partial: 'Kısmi alan kapsamı', limited: 'Sınırlı alan kapsamı' } as const
const DEFAULT_PREFERENCES: Preferences = { quiet_only: false, avoid_technology: false, high_safety_score_only: false }
const tint = ['lilac', 'peach', 'mint', 'yellow', 'sky']
const RULE_LABELS: Record<string, string> = {
  'R-AGE-PASS': 'Yaş aralığı kontrolü başarılı',
  'R-QUIET-PASS': 'Sessizlik eşiği sağlandı',
  'R-TECH-PASS': 'Düşük teknoloji koşulu sağlandı',
  'R-SAFETY-RATING-PASS': 'Kaynak güvenlik puanı eşiği sağlandı',
  'R-INTEREST-MATCH': 'Seçilen ilgi alanlarından en az biri eşleşti',
  'R-SCORE-WEIGHTED': 'Ağırlıklı değerlendirme tamamlandı',
}


function productEmoji(product: Product) {
  const name = product.name.toLocaleLowerCase('tr-TR')
  if (/yapboz|puzzle|puzıl/.test(name)) return '🧩'
  if (/teleskop|dürbün/.test(name)) return '🔭'
  if (/jenga|denge kulesi/.test(name)) return '🪵'
  if (/mikroskop/.test(name)) return '🔬'
  if (/bitki|bahçe|tohum|çiçek/.test(name)) return '🌱'
  if (/resim|boyama|palet|sulu boya/.test(name)) return '🎨'
  if (/robot|arduino/.test(name)) return '🤖'
  if (/kitap|hikaye|hikâye|masal/.test(name)) return '📚'
  if (/satranç/.test(name)) return '♟️'
  if (/futbol|topu|basketbol/.test(name)) return '⚽'
  if (/müzik|piyano|org|gitar/.test(name)) return '🎵'
  const category = product.category
  if (/Bilim|STEM|Teknoloji/.test(category)) return '🔭'
  if (/Müzik/.test(category)) return '🎹'
  if (/Spor|Fiziksel/.test(category)) return '🏀'
  if (/Doğa/.test(category)) return '🌿'
  if (/Sanat|Yaratıcı|Beceri|Hobi|İnşa/.test(category)) return '🎨'
  if (/Bebek|Duyusal/.test(category)) return '🧸'
  if (/Mantık|Bilişsel/.test(category)) return '🧩'
  if (/Dil/.test(category)) return '📖'
  return '🎁'
}

function ProductArtwork({ product, index = 0, compact = false }: { product: Product; index?: number; compact?: boolean }) {
  return <div className={`product-art ${tint[index % tint.length]} ${compact ? 'compact' : ''}`} role="img" aria-label={`${product.name}: temsili simge, gerçek ürün fotoğrafı değildir`}>
    <span className="art-bubble bubble-a"/><span className="art-bubble bubble-b"/>
    <span className="product-emoji" aria-hidden="true">{productEmoji(product)}</span><span className="art-label">Temsili simge</span>
    <span className="art-sticker"><Sparkles size={13}/></span>
  </div>
}

function ProductCard({ item, index, onSelect }: { item: Product; index: number; onSelect: (p: Product) => void }) {
  return <article className="catalog-card">
    <ProductArtwork product={item} index={index}/>
    <div className="catalog-card-body">
      <div className="card-meta"><span className="category-pill">{item.category}</span><span>{item.age_min}–{item.age_max} yaş</span></div>
      <h3>{item.name}</h3>
      <button className="text-link" type="button" onClick={() => onSelect(item)}>Ürün detayları <ArrowUpRight size={16}/></button>
    </div>
  </article>
}

function ScoreCircle({ score }: { score: number }) {
  return <div className="score-circle" style={{ background: `conic-gradient(#7860dd ${Math.max(0,Math.min(score,100))}%, #eeeaf9 0)` }} aria-label={`${score} / 100 uyum puanı`}>
    <div className="score-circle-inner"><strong>{score}</strong><small>/100</small></div>
  </div>
}

function RecommendationCard({ result, index, onSelect }: { result: RankedProduct; index: number; onSelect: (r: RankedProduct) => void }) {
  const p = result.product
  return <article className="recommendation-card">
    <div className="recommendation-head"><span className={`rank-chip ${index === 0 ? 'best' : ''}`}>{index === 0 ? <Star size={14} fill="currentColor"/> : <Sparkles size={14}/>} {index === 0 ? 'Öne çıkan öneri' : `#${index + 1} öneri`}</span><span className="category-pill">{p.category}</span></div>
    <div className="rec-center"><ProductArtwork product={p} index={index} compact/><ScoreCircle score={result.score}/></div>
    <h3>{p.name}</h3>
    <p className="muted tiny">{p.age_min}–{p.age_max} yaş için kaynak aralığı</p>
    <div className="reason-list">{result.reasons.slice(0,2).map((reason, i) => <div key={i}><CheckCircle2 size={15}/><span>{reason}</span></div>)}</div>
    <div className={`evidence-chip ${result.evidence.level}`}>{EVIDENCE_TEXT[result.evidence.level]}</div>
    <div className="rec-bottom"><span title="Puanlamada gereken kaynak puan alanlarından kaçının mevcut olduğu; doğruluk oranı değildir">Puan verisi <b>%{result.coverage}</b> <small>({result.evidence.observed}/{result.evidence.expected})</small></span><button type="button" className="round-action" aria-label={`${p.name} ayrıntıları`} onClick={() => onSelect(result)}><ArrowUpRight size={19}/></button></div>
  </article>
}

function ProductModal({ product, recommendation, onClose }: {
  product: Product; recommendation?: RankedProduct; onClose: () => void
}) {
  const closeButton = useRef<HTMLButtonElement>(null)
  const link = `https://www.trendyol.com/sr?q=${encodeURIComponent(product.name)}`
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    function close(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const dialog = closeButton.current?.closest('[role="dialog"]')
        const focusable = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')
        if (!focusable?.length) return
        const first = focusable[0]; const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = previousOverflow; previousFocus?.focus() }
  }, [onClose])
  return <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <section className="product-modal" role="dialog" aria-modal="true" aria-label={`${product.name} ayrıntıları`}>
      <button className="modal-close" ref={closeButton} onClick={onClose} type="button" aria-label="Kapat"><X size={20}/></button>
      <div className="modal-visual"><ProductArtwork product={product}/></div>
      <div className="modal-content">
        <span className="category-pill">{product.category}</span><h2>{product.name}</h2>
        <p className="muted">Kaynak yaş aralığı: {product.age_min}–{product.age_max} yaş</p>
        {recommendation && <section className="explain-panel" aria-labelledby="score-heading">
          <div className="explain-heading"><h3 id="score-heading">Bu ürün neden önerildi?</h3><span className="explain-score">{recommendation.score}/100</span></div>
          <p className="muted tiny">Kişisel seçimlerine göre mevcut kriterlerden hesaplanan puandır; olasılık, onay ya da güvenlik garantisi değildir.</p>
          <div className={`evidence-alert ${recommendation.evidence.level}`} role="note">
            <strong>{EVIDENCE_TEXT[recommendation.evidence.level]}: %{recommendation.coverage} ({recommendation.evidence.observed}/{recommendation.evidence.expected} puan alanı)</strong>
            {recommendation.evidence.missing_metrics.length > 0 && <p><b>Eksik kriterler:</b> {recommendation.evidence.missing_metrics.map(k => METRICS[k] ?? k).join(', ')}.</p>}
            <p>Yüksek bir uyum puanı, eksik kaynak puanlarını tamamlamaz. Bu oran veri alanı doluluğudur; ürün doğruluğunu, güvenilirliğini veya güvenliğini ölçmez.</p>
          </div>
          <div className="score-components" aria-label="Uyum puanı hesaplama bileşenleri">
            {recommendation.score_components.map(component => <div className="score-component" key={component.key}>
              <div className="component-header"><strong>{component.title}</strong><span>+{component.contribution.toLocaleString('tr-TR')} puan</span></div>
              <div className="component-track"><div style={{ width: `${Math.max(0, Math.min(100, component.value * 10))}%` }}/></div>
              <p>Ham bileşen: {component.value}/10 · Gösterilen ağırlık: %{component.weight} · {component.details}</p>
            </div>)}
          </div>
          <p className="muted tiny">Toplam skor yuvarlanmadan hesaplanır. Bileşen katkıları ve yüzdelik ağırlıklar ayrı ayrı yuvarlandığından küçük farklar olabilir.</p>
          <h4>Karar gerekçeleri</h4>
          <ul className="explain-reasons">{recommendation.reasons.map((reason, index) => <li key={index}><CheckCircle2 size={15}/>{reason}</li>)}</ul>
          <h4>Uzman sistemin uyguladığı kontroller</h4>
          <ul className="rule-friendly">{recommendation.fired_rules.map(rule => <li key={rule}><CheckCircle2 size={15}/><span>{RULE_LABELS[rule] ?? rule}</span></li>)}</ul>
          <details className="rule-trace"><summary>Geliştiriciler için teknik kural kodları</summary><ul>{recommendation.fired_rules.map(rule => <li key={rule}><code>{rule}</code> — {RULE_LABELS[rule] ?? rule}</li>)}</ul></details>
        </section>}
        <h3>Kriter profili</h3>
        <p className="muted tiny">Tüm değerler kaynak veri kümesindeki 0–10 puanlardır; sertifika veya ölçülmüş ürün özelliği değildir.</p>
        <div className="metrics-grid">{Object.entries(product.metrics).map(([key,value]) => <div className="metric" key={key}>
          <div className="metric-top"><span>{METRICS[key] || key}</span><b>{value}/10</b></div>
          <div className="metric-bar"><span style={{width: `${value*10}%`}}/></div>
        </div>)}</div>
        {product.quality_notes.length > 0 && <div className="source-warning"><ShieldAlert size={17}/><div>{product.quality_notes.map((n,i)=><p key={i}>{n}</p>)}</div></div>}
        <div className="source-note"><Database size={16}/><span>Kaynak: {product.sources.map(s => `${s.dataset} #${s.source_id}`).join(' · ')}</span></div>
        <div className="modal-bottom"><a className="button primary" href={link} target="_blank" rel="noopener noreferrer">Ürünü internette ara <ExternalLink size={16}/></a><span className="muted tiny">Bağlantı mağaza aramasıdır; stok ve fiyat doğrulanmaz.</span></div>
      </div>
    </section>
  </div>
}

function App() {
  const [view, setView] = useState<View>('home')
  const [navOpen, setNavOpen] = useState(false)
  const [meta, setMeta] = useState<Meta | null>(null)
  const [metaError, setMetaError] = useState('')
  const [age, setAge] = useState(7)
  const [goals, setGoals] = useState<Goal[]>(['cognitive'])
  const [interests, setInterests] = useState<Interest[]>([])
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [rankingMode, setRankingMode] = useState<RankingMode>('evidence_then_score')
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<RecommendationResponse | null>(null)
  const [working, setWorking] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [selected, setSelected] = useState<{ product: Product; recommendation?: RankedProduct } | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [catalog, setCatalog] = useState<Page | null>(null)
  const [catalogError, setCatalogError] = useState('')
  const [catalogLoading, setCatalogLoading] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const wizardRef = useRef<HTMLElement>(null)

  useEffect(() => { api.meta().then(setMeta).catch((e: Error) => setMetaError(e.message)) }, [])
  useEffect(() => {
    if (view !== 'catalog') return
    let active = true
    const timer = setTimeout(() => {
      setCatalogLoading(true)
      api.products({page, page_size: 12, q: search.trim(), category}).then(v => {
        if (active) { setCatalog(v); setCatalogError('') }
      }).catch((e: Error) => { if (active) setCatalogError(e.message) }).finally(() => { if (active) setCatalogLoading(false) })
    }, 200)
    return () => { active = false; clearTimeout(timer) }
  }, [view, page, search, category])

  function navigate(target: View) {
    setView(target); setNavOpen(false)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  function start() { setView('home'); setNavOpen(false); setTimeout(() => wizardRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 40) }
  function toggleGoal(k: Goal) { setGoals(s => s.includes(k) ? s.filter(v => v !== k) : [...s,k]) }
  function toggleInterest(k: Interest) { setInterests(s => s.includes(k) ? s.filter(v => v !== k) : [...s,k]) }
  async function analyze() {
    setWorking(true);setRequestError('');setResult(null)
    try {
      const response = await api.recommend({age, goals, interests, preferences, max_results:9, ranking_mode:rankingMode})
      setResult(response);setStep(3)
      setTimeout(() => wizardRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),50)
    } catch (e) {setRequestError(e instanceof Error ? e.message : 'İstek başarısız oldu.')}
    finally {setWorking(false)}
  }
  function restart() {setStep(0);setResult(null);setRequestError('');wizardRef.current?.scrollIntoView({behavior:'smooth'})}
  const count = meta?.product_count ?? '397'
  const stepTitles = ['Çocuğu tanıyalım', 'İlgi ve gelişim alanları', 'Tercihlerini belirle']
  return <div ref={topRef} className="app-shell">
    <div className="announcement"><Sparkles size={14}/> Uzman bilgisinden güç alan, açıklanabilir hediye önerileri <span className="announcement-star">✳</span> Akademik projeden modern ürüne</div>
    <header className="site-header"><div className="container nav-inner">
      <button type="button" className="brand" onClick={() => navigate('home')} aria-label="Hediye Dehası ana sayfa"><span className="brand-symbol">✳</span><span>hediye<span className="brand-purple">dehası</span><small>AKILLI SEÇİM REHBERİ</small></span></button>
      <nav className={`main-nav ${navOpen ? 'open' : ''}`} aria-label="Ana menü">
        <button type="button" onClick={() => navigate('home')} className={view === 'home' ? 'active' : ''}>Ana Sayfa</button>
        <button type="button" onClick={() => navigate('catalog')} className={view === 'catalog' ? 'active' : ''}>Hediye Kataloğu</button>
        <button type="button" onClick={() => navigate('method')} className={view === 'method' ? 'active' : ''}>Nasıl Çalışır?</button>
      </nav>
      <div className="nav-cta"><button className="button primary small" type="button" onClick={start}>Hediye Bul <ArrowUpRight size={16}/></button></div>
      <button type="button" className="mobile-menu" onClick={() => setNavOpen(v => !v)} aria-expanded={navOpen} aria-label="Menüyü aç / kapat">{navOpen ? <X/> : <Menu/>}</button>
    </div></header>
    {view === 'home' && <main>
      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot"/> HER ÇOCUK BİR DÜNYA, HER HEDİYE BİR KEŞİF</span>
          <h1>Küçük bir hediye,<br/><span>kocaman bir</span><br/><em>mutluluk.</em></h1>
          <p>Çocuğun yaşını, ilgi alanlarını ve gelişim hedeflerini seç. Uzman sistemimiz <b>neden önerdiğini açıklayarak</b> sana en uygun hediye seçeneklerini bulsun.</p>
          <div className="hero-actions"><button className="button primary large" type="button" onClick={start}>Haydi, hediyeni bul <ArrowRight size={19}/></button><button className="button ghost large" type="button" onClick={() => navigate('method')}><CircleHelp size={19}/> Nasıl çalışır?</button></div>
          <div className="hero-proof"><div className="proof-stars">★★★★★</div><span><b>{count} ürün</b> · Açıklanabilir öneriler · Ücretsiz</span></div>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <span className="hero-spark spark-one">✦</span><span className="hero-spark spark-two">✳</span><span className="hero-spark spark-three">✧</span>
          <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
          <div className="hero-gift gift-one"><span>🧸</span><div className="gift-base"/></div>
          <div className="hero-gift gift-two"><span>🎨</span><div className="gift-base"/></div>
          <div className="hero-gift gift-three"><span>🔭</span><div className="gift-base"/></div>
          <div className="floating-tag tag-one"><Star size={16} fill="currentColor"/> Tam ona göre!</div>
          <div className="floating-tag tag-two"><Heart size={16} fill="currentColor"/> Sevgiyle seçildi</div>
          <span className="hero-floor"/>
        </div>
      </div></section>
      <section className="features-strip"><div className="container feature-grid"><div><span className="feature-symbol purple"><Brain size={23}/></span><span><b>Uzman sistem</b><small>Veriye dayalı kurallar</small></span></div><div><span className="feature-symbol coral"><Target size={23}/></span><span><b>Kişiye özel</b><small>Yaş ve ilgi alanı uyumu</small></span></div><div><span className="feature-symbol green"><Lightbulb size={23}/></span><span><b>Açıklanabilir</b><small>Her önerinin bir nedeni var</small></span></div><div><span className="feature-symbol blue"><Shield size={23}/></span><span><b>Şeffaf</b><small>Kaynak ve kısıtlar görünür</small></span></div></div></section>
      <section className="wizard-section" id="hediye-bul" ref={wizardRef}><div className="container"><div className="section-heading center"><span className="section-kicker"><WandSparkles size={17}/> SANA ÖZEL HEDİYE REHBERİ</span><h2>En güzel hediyeyi <span>birlikte bulalım.</span></h2><p>Sadece birkaç adımda, çocuğun dünyasına uygun önerilere ulaş.</p></div>
        <div className="wizard-shell"><div className="wizard-sidebar"><div className="sidebar-decoration">✳</div><div className="wizard-side-intro"><span className="sidebar-mini">HEDİYE YOLCULUĞUN</span><h3>Harika bir hediye için birkaç küçük ipucu yeter.</h3><p>Seçimlerin doğrultusunda uzman sistemimiz mevcut ürünleri değerlendirecek.</p></div>
          <div className="wizard-progress">{stepTitles.map((title,i) => <div className={`progress-item ${step === i ? 'current' : ''} ${step > i ? 'completed' : ''}`} key={title}><span className="progress-dot">{step > i ? <Check size={17}/> : String(i+1).padStart(2,'0')}</span><div><b>{title}</b><small>{['Doğru yaş aralığı','Neleri seviyor?','Kişisel hassasiyetler'][i]}</small></div></div>)}</div>
          <div className="sidebar-footer"><span>💡</span><p>Öneri skoru hesaplamadır; gerçek güvenlik sertifikası veya başarı olasılığı değildir.</p></div>
        </div>
        <div className="wizard-main">
          {step < 3 && <div className="wizard-topline"><span>ADIM {step+1} / 3</span><div className="step-bars">{[0,1,2].map(i=><span key={i} className={i<=step ? 'on' : ''}/>)}</div></div>}
          {step === 0 && <div className="wizard-panel"><span className="question-icon">🎂</span><h3>Hediye alacağın çocuk kaç yaşında?</h3><p>Yaşı tam yıl olarak seç. Kaynak veri tabanındaki yaş aralıklarına göre ön eleme yapacağız.</p>
            <div className="age-pick"><button type="button" onClick={()=>setAge(a=>Math.max(0,a-1))} disabled={age===0} aria-label="Yaşı azalt"><ChevronLeft size={23}/></button><div><strong>{age}</strong><small>YAŞINDA</small></div><button type="button" onClick={()=>setAge(a=>Math.min(17,a+1))} disabled={age===17} aria-label="Yaşı artır"><ChevronRight size={23}/></button></div>
            <input aria-label="Çocuğun yaşı" type="range" min="0" max="17" value={age} onChange={e=>setAge(Number(e.target.value))} className="age-range"/><div className="range-labels"><span>0 yaş</span><span>17 yaş</span></div>
            <div className="hint"><Lightbulb size={17}/><span>Kaynak yaş aralıkları üretici tarafından doğrulanmış güvenlik etiketi yerine geçmez.</span></div>
          </div>}
          {step === 1 && <div className="wizard-panel"><span className="question-icon">🌈</span><h3>Onu ne heyecanlandırıyor?</h3><p>Gelişim hedefleri ve sevdiği etkinlikleri seçebilirsin. Seçmediğin alanlar engel oluşturmaz.</p>
            <div className="field-label">DESTEKLEMEK İSTEDİĞİN GELİŞİM ALANLARI <span>İsteğe bağlı</span></div><div className="goal-grid">{GOALS.map(g=><button type="button" key={g.key} className={`goal-choice ${goals.includes(g.key)?'picked':''}`} onClick={()=>toggleGoal(g.key)} aria-pressed={goals.includes(g.key)}><span className="choice-emoji">{g.symbol}</span><span><b>{g.label}</b><small>{g.description}</small></span><span className="choice-check">{goals.includes(g.key) && <Check size={13}/>}</span></button>)}</div>
            <div className="field-label space-above">İLGİ ALANLARI <span>Birden fazla seçebilirsin</span></div><div className="interest-grid">{INTERESTS.map(g=><button type="button" key={g.key} className={`interest-choice ${interests.includes(g.key)?'picked':''}`} onClick={()=>toggleInterest(g.key)} aria-pressed={interests.includes(g.key)}><span>{g.symbol}</span>{g.label}</button>)}</div>
          </div>}
          {step === 2 && <div className="wizard-panel"><span className="question-icon">✨</span><h3>Biraz da tercihlerini öğrenelim.</h3><p>İşaretlediğin koşullar kesin eleme yapar. Kaynak veride puanı eksik ürünler de elenir.</p>
            <div className="preference-list"><label className="preference-row"><span className="pref-icon"><Moon size={21}/></span><span className="pref-content"><b>Sessiz ürünler olsun</b><small>Kaynak sessizlik puanı en az 7/10</small></span><input type="checkbox" checked={preferences.quiet_only} onChange={e=>setPreferences(p=>({...p, quiet_only:e.target.checked}))}/><span className="toggle-track"/></label>
            <label className="preference-row"><span className="pref-icon"><BookOpen size={21}/></span><span className="pref-content"><b>Az teknoloji kullansın</b><small>Kaynak teknoloji yoğunluğu en fazla 3/10</small></span><input type="checkbox" checked={preferences.avoid_technology} onChange={e=>setPreferences(p=>({...p, avoid_technology:e.target.checked}))}/><span className="toggle-track"/></label>
            <label className="preference-row"><span className="pref-icon"><Shield size={21}/></span><span className="pref-content"><b>Yüksek kaynak güvenlik puanı</b><small>Öznel veri puanı en az 8/10; sertifika değildir</small></span><input type="checkbox" checked={preferences.high_safety_score_only} onChange={e=>setPreferences(p=>({...p, high_safety_score_only:e.target.checked}))}/><span className="toggle-track"/></label></div>
            <div className="ranking-setting">
              <label htmlFor="ranking-mode">ÖNERİLERİN SIRALAMASI</label>
              <select id="ranking-mode" value={rankingMode} onChange={e => setRankingMode(e.target.value as RankingMode)}>
                <option value="evidence_then_score">Önce veri kapsamı, sonra uyum puanı (önerilen)</option>
                <option value="score_only">Yalnızca hesaplanan uyum puanı</option>
              </select>
              <p>Kapsam öncelikli sıralama, eksik kaynak puanları olan ürünleri geriye alır. Her iki yöntemde de puanın kendisi değişmez.</p>
            </div>
            <div className="hint"><ShieldAlert size={17}/><span>Satın almadan önce ürünün gerçek yaş etiketini, uyarılarını ve sertifikalarını mutlaka kontrol et.</span></div>
          </div>}
          {step === 3 && result && <div className="wizard-panel result-panel"><span className="question-icon">🎉</span><h3>İşte sana özel öneriler!</h3><p>{age} yaş için <b>{result.age_eligible}</b> kaynak kaydı yaş aralığına uydu. Diğer kuralların ardından <b>{result.filtered_eligible}</b> uygun kayıt bulundu.</p>
            <div className="ranking-summary"><Database size={16}/><span>{result.ranking_mode === 'evidence_then_score' ? 'Sıralama: önce kaynak alanlarının kapsamı, ardından uyum puanı.' : 'Sıralama: yalnızca uyum puanına göre.'} Puanlar güven veya başarı olasılığı değildir.</span></div>
            <div className="results-stats"><div><strong>{result.filtered_eligible}</strong><small>Kriterlere uyan ürün</small></div><div><strong>{result.recommendations.length}</strong><small>Gösterilen öneri</small></div><div><strong>{Object.values(result.excluded_by_rule).reduce((a,b)=>a+b,0)}</strong><small>Elenen kayıt</small></div></div>
            {result.recommendations.length > 0 ? <div className="result-grid">{result.recommendations.map((r,i)=><RecommendationCard key={r.product.id} result={r} index={i} onSelect={(r) => setSelected({product:r.product, recommendation:r})}/>)}</div> : <div className="empty-box"><span>🔎</span><h4>Bu seçimlerle sonuç bulunamadı.</h4><p>Bazı zorunlu tercihleri kaldırıp yeniden deneyebilirsin.</p></div>}
            <details className="how-scored"><summary><CircleHelp size={17}/> Bu puanlar nasıl hesaplandı?</summary><div><p><b>Uyum puanı =</b> mevcut gelişim, ilgi alanı ve eğitsel/pratik kriter puanlarının ağırlıklı ortalaması. 0–100 aralığındadır ve olasılık değildir. <b>Alan kapsamı</b> ayrıca 0–100 olarak gösterilir; kaynakta eksik puanları belirtir. Varsayılan sıralama önce alan kapsamını dikkate alır.</p>{result.recommendations[0] && <div className="component-table">{result.recommendations[0].score_components.map(c=><div key={c.key}><span>{c.title} · %{c.weight} ağırlık</span><b>{c.contribution} puan</b></div>)}</div>}</div></details>
            <div className="warning-list">{result.warnings.map((w,i)=><p key={i}><ShieldAlert size={16}/>{w}</p>)}</div>
          </div>}
          {requestError && <div className="error-banner" role="alert">{requestError}</div>}
          <div className="wizard-actions">{step===3 ? <button className="button subtle" type="button" onClick={restart}><RotateCcw size={17}/> Yeniden seçim yap</button> : <><button className="button subtle" type="button" onClick={()=>setStep(v=>Math.max(0,v-1))} disabled={step===0}><ArrowLeft size={17}/> Geri</button>{step<2 ? <button className="button primary" type="button" onClick={()=>setStep(v=>v+1)}>Devam et <ArrowRight size={17}/></button> : <button className="button primary" type="button" onClick={analyze} disabled={working}>{working ? 'Analiz ediliyor…' : 'Hediyeleri öner'} <Sparkles size={17}/></button>}</>}</div>
        </div></div>
      </div></section>
      <section className="simple-steps"><div className="container"><div className="section-heading center"><span className="section-kicker">NASIL ÇALIŞIYOR?</span><h2>Üç adımda, <span>içine sinen bir seçim.</span></h2></div><div className="steps-cards"><div><span className="steps-number">01</span><div className="steps-emoji">🧒</div><h3>Çocuğu tanı</h3><p>Yaşını, ilgi alanlarını ve gelişim hedeflerini belirt.</p></div><div><span className="steps-number">02</span><div className="steps-emoji">🧠</div><h3>Uzman kuralları çalışsın</h3><p>Uygun olmayan ürünler elensin, kalanlar ölçütlerle puanlansın.</p></div><div><span className="steps-number">03</span><div className="steps-emoji">🎁</div><h3>Nedenini öğren</h3><p>Her önerinin puanını, gerekçesini ve kaynak bilgilerini gör.</p></div></div></div></section>
    </main>}
    {view==='catalog' && <main className="catalog-page"><div className="container"><div className="page-intro"><span className="section-kicker"><Database size={17}/> KAYNAKLARA DAYALI KATALOG</span><h1>Minik keşifler için <span>büyük fikirler.</span></h1><p>Üniversite çalışmasındaki iki tarihsel veri kümesinden normalize edilmiş ürün kayıtlarını keşfet. Gerçek fiyat, stok ve sertifika bilgisi içermez.</p></div>
      <div className="catalog-toolbar"><div className="search-field"><Search size={19}/><input type="search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Ürün adı ara…" aria-label="Ürünlerde ara"/></div><label className="catalog-select"><SlidersHorizontal size={18}/><select value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}} aria-label="Kategori seç"><option value="">Tüm kategoriler</option>{meta?.categories.map(c=><option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}</select></label></div>
      <div className="catalog-count"><b>{catalog?.total ?? '—'}</b> ürün bulundu {catalogLoading && <span>· Yükleniyor…</span>}</div>
      {catalogError ? <div className="error-banner" role="alert">{catalogError} <button className="text-link" type="button" onClick={()=>navigate('home')}>Ana sayfaya dön</button></div> : catalog?.items.length ? <div className="catalog-grid">{catalog.items.map((p,i)=><ProductCard key={p.id} item={p} index={i+page} onSelect={(product) => setSelected({product})}/>)}</div> : !catalogLoading && <div className="empty-box"><span>🕵️</span><h3>Ürün bulunamadı.</h3><p>Arama terimini veya kategoriyi değiştirmeyi dene.</p></div>}
      {catalog && catalog.total > 12 && <div className="pagination"><button type="button" disabled={page<=1} onClick={()=>setPage(v=>v-1)}><ChevronLeft size={17}/> Önceki</button><span>Sayfa {page} / {Math.ceil(catalog.total / 12)}</span><button type="button" disabled={page>=Math.ceil(catalog.total/12)} onClick={()=>setPage(v=>v+1)}>Sonraki <ChevronRight size={17}/></button></div>}
    </div></main>}
    {view==='method' && <main className="method-page"><div className="container"><div className="page-intro"><span className="section-kicker"><Brain size={17}/> UZMAN SİSTEM MİMARİSİ</span><h1>Akıllı öneri, <span>şeffaf karar.</span></h1><p>Hediye Dehası, ürünleri tahmin yapan bir yapay zekâ modeliyle değil, açık kurallar ve kaynak kriter puanlarıyla karşılaştırır. Her karar yeniden üretilebilir.</p></div>
      <div className="method-layout"><div className="method-step"><div className="method-icon"><Database size={24}/></div><div><span>01 · BİLGİ TABANI</span><h2>Kaynak veriyi koruyoruz.</h2><p>İki ayrı akademik ürün veri kümesindeki yaş aralıkları, kategoriler ve 0–10 kriter puanları standart bir kataloğa dönüştürülür. Çelişkiler not edilir; eksik değerler tahmin edilmez.</p></div></div>
      <div className="method-step"><div className="method-icon"><Shield size={24}/></div><div><span>02 · KURAL MOTORU</span><h2>Zorunlu koşullar önce gelir.</h2><p>Yaş aralığı her zaman zorunludur. İstenirse sessizlik ≥ 7, teknoloji ≤ 3 ve öznel güvenlik puanı ≥ 8 sınırları devreye girer. Bir kuralı ihlal eden ürün, yüksek puan alsa da listede kalamaz.</p></div></div>
      <div className="method-step"><div className="method-icon"><Target size={24}/></div><div><span>03 · PUANLAMA</span><h2>Uyum puanı hesaplanır.</h2><p>Seçilen gelişim hedefleri, ilgi alanı eşleşmeleri ve eğitsel/pratik kriterler ağırlıklı ortalamaya alınır. Kriter eksikse o bileşen yeniden ağırlıklandırılır. Veri alanlarının kapsama düzeyi ayrıca gösterilir; varsayılan sıralama önce kapsama düzeyini, sonra uyumu dikkate alır. Puan yüzde olasılık değildir.</p></div></div>
      <div className="method-step"><div className="method-icon"><Lightbulb size={24}/></div><div><span>04 · AÇIKLAMA</span><h2>Neden önerildiği görünür.</h2><p>Her üründe hesaplanan puan, kaynak alanı kapsamı, eksik kriterler, anlaşılır kural açıklamaları ve kaynak kimlikleri gösterilir. Ürün simgeleri temsildir, gerçek fotoğraf değildir.</p></div></div></div>
      <div className="ethics-box"><ShieldAlert size={28}/><div><h3>Çocuk güvenliği hakkında önemli uyarı</h3><p>Orijinal veri tabanındaki yaş ve “güvenlik” puanları ticari ürünlerin güvenlik sertifikasını temsil etmez. Uygulama CE, EN 71, uygunluk beyanı veya ürün testlerini doğrulamaz. Ürünü satın almadan önce ambalajdaki gerçek yaş uyarılarını, boğulma risklerini ve ilgili standart/sertifikaları bağımsız olarak doğrulayın.</p></div></div><button className="button primary" type="button" onClick={start}>Kendin dene <ArrowRight size={17}/></button>
    </div></main>}
    <footer className="footer"><div className="container footer-main"><div><div className="brand footer-brand"><span className="brand-symbol">✳</span><span>hediye<span className="brand-purple">dehası</span></span></div><p>Üniversitede geliştirilen Hediye Seçim Uzman Sistemi'nin yeniden mühendislik çalışması. Kaynak veriye sadık, açıklanabilir karar destek sistemi.</p></div><div><h4>Keşfet</h4><button type="button" onClick={()=>navigate('home')}>Ana sayfa</button><button type="button" onClick={()=>navigate('catalog')}>Hediye kataloğu</button><button type="button" onClick={()=>navigate('method')}>Yöntemimiz</button></div><div><h4>Bilgilendirme</h4><p>Kaynak puanları ticari güvenlik, stok ve fiyat doğrulaması değildir. Ücretsiz, akademik temelli karar destek prototipi.</p></div></div><div className="container footer-bottom"><span>© 2026 Hediye Dehası · Üniversite projesi yeniden geliştirme</span><span>Sevgiyle ve kanıta sadakatle tasarlandı ✳</span></div></footer>
    {metaError && <div className="api-alert" role="alert">API bağlantısı kurulamadı: {metaError} <button type="button" onClick={()=>setMetaError('')} aria-label="Uyarıyı kapat"><X size={16}/></button></div>}
    {selected && <ProductModal product={selected.product} recommendation={selected.recommendation} onClose={()=>setSelected(null)}/>}
  </div>
}

export default App
