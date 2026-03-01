/* ══════════════════════════════════════════════
   RISK HORIZON v3.0 — Full Feature Game Engine
   ══════════════════════════════════════════════ */

// ── Config ──
const TOTAL_MONTHS = 120; // 10 Years

const REGIONS = [
  { id: 'sanayi', name: 'Sanayi Bölgesi', icon: '🏭', riskMod: 1.2, desc: 'Yüksek endüstriyel risk' },
  { id: 'merkez', name: 'Şehir Merkezi', icon: '🏙️', riskMod: 0.9, desc: 'Ortalama risk' },
  { id: 'liman', name: 'Liman Bölgesi', icon: '⚓', riskMod: 1.1, desc: 'Depolama riski yüksek' },
  { id: 'campus', name: 'Kampüs Bölgesi', icon: '🏫', riskMod: 0.7, desc: 'Düşük risk bölgesi' },
];

const FACILITY_TYPES = [
  { type: 'factory', icon: '🏭', name: 'Fabrika', riskRange: [40, 70], premRange: [5500, 14000], valRange: [200000, 800000] },
  { type: 'office', icon: '🏢', name: 'Ofis Binası', riskRange: [15, 35], premRange: [2000, 5500], valRange: [100000, 400000] },
  { type: 'warehouse', icon: '📦', name: 'Depo / Antrepo', riskRange: [45, 75], premRange: [7000, 17500], valRange: [300000, 900000] },
  { type: 'hotel', icon: '🏨', name: 'Otel', riskRange: [25, 50], premRange: [3500, 10500], valRange: [400000, 1200000] },
  { type: 'hospital', icon: '🏥', name: 'Hastane', riskRange: [20, 40], premRange: [4200, 8400], valRange: [500000, 1500000] },
  { type: 'gasstation', icon: '⛽', name: 'Akaryakıt İstasyonu', riskRange: [55, 85], premRange: [10500, 24500], valRange: [150000, 500000] },
  { type: 'mall', icon: '🛒', name: 'AVM', riskRange: [30, 55], premRange: [5500, 12600], valRange: [600000, 2000000] },
  { type: 'school', icon: '🏫', name: 'Okul', riskRange: [15, 30], premRange: [1400, 4200], valRange: [100000, 350000] },
  { type: 'restaurant', icon: '🍽️', name: 'Restoran', riskRange: [35, 60], premRange: [2800, 7000], valRange: [80000, 300000] },
  { type: 'textile', icon: '🧵', name: 'Tekstil Atölyesi', riskRange: [50, 80], premRange: [7000, 15400], valRange: [200000, 700000] },
];

const RISK_FACTORS = [
  { id: 'sprinkler', name: 'Sprinkler Sistemi', icon: '🚿', good: 'Mevcut', bad: 'Yok', weight: 15 },
  { id: 'extinguish', name: 'Manuel Söndürme Sist.', icon: '🧯', good: 'Yeterli', bad: 'Yetersiz', weight: 8 },
  { id: 'alarm', name: 'Yangın Algılama & Alarm', icon: '🚨', good: 'Güncel', bad: 'Eski/Arızalı', weight: 12 },
  { id: 'evacuation', name: 'Acil Çıkış Planı', icon: '🚪', good: 'Var', bad: 'Eksik', weight: 5 },
  { id: 'electrical', name: 'Elektrik Tesisatı', icon: '⚡', good: 'Yeni', bad: 'Eski/Riskli', weight: 12 },
  { id: 'storage', name: 'Yanıcı Madde Depolaması', icon: '☣️', good: 'Uygun', bad: 'Tehlikeli', weight: 14 },
  { id: 'structural', name: 'Yapısal Dayanıklılık', icon: '🏗️', good: 'Sağlam', bad: 'Zayıf', weight: 10 },
  { id: 'training', name: 'Personel Eğitimi', icon: '📚', good: 'Eğitimli', bad: 'Eğitimsiz', weight: 6 },
];

const RECOMMENDATIONS = [
  { id: 'training', name: 'Yangın Eğitimi & Tatbikat', icon: '🏃', cost: 1000, reduction: 5, chance: 0.90 },
  { id: 'extinguish', name: 'Söndürücü Ekipman Dağıtımı', icon: '🧯', cost: 3000, reduction: 8, chance: 0.85 },
  { id: 'alarm', name: 'Alarm & Algılama Yenileme', icon: '🚨', cost: 5000, reduction: 12, chance: 0.70 },
  { id: 'electrical', name: 'Tesisat İyileştirmesi', icon: '⚡', cost: 8000, reduction: 12, chance: 0.60 },
  { id: 'storage', name: 'Bölge İzolasyonu', icon: '☣️', cost: 12000, reduction: 14, chance: 0.50 },
  { id: 'sprinkler', name: 'Sprinkler Kurulumu', icon: '🚿', cost: 15000, reduction: 20, chance: 0.40 },
  { id: 'structural', name: 'Yapısal Güçlendirme', icon: '🏗️', cost: 30000, reduction: 25, chance: 0.20 },
];

const ACHIEVEMENTS = [
  { id: 'first_policy', icon: '📋', name: 'İlk Poliçe', desc: 'İlk müşteriyi sigortala', check: s => s.portfolio.length >= 1 },
  { id: 'five_policies', icon: '📑', name: '5 Poliçe', desc: '5 müşteriyi sigortala', check: s => s.portfolio.length >= 5 },
  { id: 'ten_policies', icon: '🗂️', name: '10 Poliçe', desc: '10 müşteriyi sigortala', check: s => s.portfolio.length >= 10 },
  { id: 'no_fire_quarter', icon: '✅', name: 'Yangınsız Çeyrek', desc: 'Hiç yangın çıkmayan çeyrek', check: (s, ctx) => ctx === 'nofire' },
  { id: 'first_fire', icon: '🔥', name: 'İlk Yangın', desc: 'İlk yangını yaşa', check: s => s.totalFires >= 1 },
  { id: 'survivor', icon: '🛡️', name: 'Hayatta Kalan', desc: '5 yangını atlatsa', check: s => s.totalFires >= 5 },
  { id: 'profit_50k', icon: '💰', name: 'Kârlı İş', desc: '$50K kâr yap', check: s => (s.totalPremium - s.totalClaims) >= 50000 },
  { id: 'profit_200k', icon: '💎', name: 'Altın Portföy', desc: '$200K kâr yap', check: s => (s.totalPremium - s.totalClaims) >= 200000 },
  { id: 'low_ratio', icon: '📉', name: 'Düşük Hasar', desc: 'Hasar oranını %40 altında tut', check: s => s.ytdPremium > 0 && s.month > 6 && (s.ytdClaims / s.ytdPremium) < 0.4 },
  { id: 'reinsurance', icon: '🏦', name: 'Reasürör', desc: 'Reasürans satın al', check: s => s.hasReinsurance },
  { id: 'top_rank', icon: '🏆', name: '1 Numara', desc: 'Sıralamada 1. ol', check: (s, ctx) => ctx === 'rank1' },
  { id: 'referral', icon: '🤝', name: 'Referans Gücü', desc: 'Referans müşteri kazan', check: (s, ctx) => ctx === 'referral' },
];

const COMPETITORS = [
  { name: 'Güven Sigorta', icon: '🟢', style: 'conservative', aggression: 0.3, skillBase: 0.6 },
  { name: 'Koruma A.Ş.', icon: '🔵', style: 'balanced', aggression: 0.5, skillBase: 0.7 },
  { name: 'Atlas Sigorta', icon: '🟡', style: 'aggressive', aggression: 0.8, skillBase: 0.5 },
  { name: 'Zirve Holding', icon: '⛰️', style: 'aggressive', aggression: 0.9, skillBase: 0.6 },
  { name: 'Nehir Sigorta', icon: '💧', style: 'conservative', aggression: 0.2, skillBase: 0.8 },
  { name: 'Güneş Grup', icon: '☀️', style: 'balanced', aggression: 0.6, skillBase: 0.5 },
  { name: 'Kalkan A.Ş.', icon: '🛡️', style: 'conservative', aggression: 0.4, skillBase: 0.7 },
  { name: 'Yıldırım Sigorta', icon: '⚡', style: 'aggressive', aggression: 0.7, skillBase: 0.4 },
  { name: 'Çınar Risk', icon: '🌳', style: 'balanced', aggression: 0.5, skillBase: 0.6 },
];

const COMPANY_NAMES = ['Yıldız', 'Atlas', 'Kuzey', 'Doğan', 'Anadolu', 'Marmara', 'Ege', 'Akdeniz', 'Boğaziçi', 'Karadeniz', 'Toros', 'Olimpos', 'Konak', 'Derya', 'Nehir', 'Güneş', 'Ay', 'Çınar', 'Lale', 'Kartal', 'Şahin', 'Aslan', 'Barış', 'Umut', 'Başarı', 'Zirve', 'Deniz', 'Orman'];
const COMPANY_SUFFIXES = ['Ltd.', 'A.Ş.', 'Holding', 'Grup', 'Ticaret', 'Sanayi', 'İşletme'];

const TICKER_MSGS = [
  '🔥 Sektörde yangın hasarları %12 arttı.', '📊 Prim gelirleri yükselişte.', '🏭 Sanayi bölgelerinde denetimler sıklaştı.',
  '⚡ Elektrik kaynaklı yangınlar artıyor.', '🚿 Sprinkler tesislerde hasar %60 daha düşük.', '📋 Yeni yangın yönetmeliği yürürlükte.',
  '💰 %70 altı hasar oranı = kârlı şirket.', '🏗️ Eski binalarda risk 3 kat fazla.', '☣️ Kimyasal depolama denetimleri artıyor.',
  '🔔 Dedektörsüz tesislerde tespit 15 dk gecikiyor.', '📚 Personel eğitimi hasarı %20 azaltıyor.', '⛽ Akaryakıt istasyonları en yüksek risk grubunda.',
  '🏆 Güven Sigorta agresif büyüme stratejisi izliyor.', '🔵 Koruma A.Ş. yeni bir reasürans anlaşması imzaladı.',
  '🟡 Atlas Sigorta yüksek riskli müşterilere odaklanıyor.', '📈 Reasürans piyasasında fiyatlar düşüyor.',
];

const UPGRADES = [
  { id: 'sales_team', name: 'Eğitimli Satış Ekibi', icon: '👔', desc: 'Müşterilerin yüksek prim tekliflerini kabul etme oranını artırır.', cost: 20000 },
  { id: 'risk_software', name: 'Gelişmiş Risk Yazılımı', icon: '💻', desc: 'Raporlarda kesin yangın çıkma olasılığını (%) gösterir.', cost: 35000 },
  { id: 'pr_campaign', name: 'Halkla İlişkiler (PR)', icon: '📢', desc: 'Her çeyrekte başvuran müşteri sayısını +1 artırır.', cost: 50000 },
  { id: 'regional_lobby', name: 'Bölgesel Lobi', icon: '🏛️', desc: 'Sanayi ve Liman gibi yüksek riskli bölgelerin risk çarpanını düşürür.', cost: 75000 },
];

const AGENT_POOL = [
  { id: 'ali', name: 'Ali Kaya', icon: '👔', portrait: 'assets/agent_ali.png', specialty: 'factory', skillBase: 3, loyaltyBase: 70, commissionRate: 0.08, bio: 'Sanayi tesislerinde 10 yıl deneyim.' },
  { id: 'zeynep', name: 'Zeynep Demir', icon: '👩‍💼', portrait: 'assets/agent_zeynep.png', specialty: 'hotel', skillBase: 4, loyaltyBase: 80, commissionRate: 0.10, bio: 'Turizm sektöründe geniş müşteri ağı.' },
  { id: 'murat', name: 'Murat Yılmaz', icon: '🧑‍💼', portrait: 'assets/agent_murat.png', specialty: 'warehouse', skillBase: 2, loyaltyBase: 60, commissionRate: 0.06, bio: 'Yeni mezun, düşük komisyon ile çalışır.' },
  { id: 'elif', name: 'Elif Arslan', icon: '👩‍🦰', portrait: 'assets/agent_elif.png', specialty: 'mall', skillBase: 5, loyaltyBase: 90, commissionRate: 0.12, bio: 'Sektörün en deneyimli acentesi. Pahalı ama etkili.' },
  { id: 'hakan', name: 'Mert İnci', icon: '🤵', portrait: 'assets/agent_hakan.png', specialty: 'gasstation', skillBase: 3, loyaltyBase: 50, commissionRate: 0.07, bio: 'Riskli sektörlere özel. Sadakati düşük olabilir.' },
  { id: 'selin', name: 'Selin Koç', icon: '👩‍💻', portrait: 'assets/agent_selin.png', specialty: 'hospital', skillBase: 4, loyaltyBase: 75, commissionRate: 0.09, bio: 'Kamu kurumlarında güçlü referansları var.' },
];

const CLIENT_PORTRAITS = ['assets/client_male_1.png', 'assets/client_female_1.png', 'assets/client_male_2.png', 'assets/client_female_2.png'];

const AGENT_HIRE_COST = 10000; // One-time hiring cost
const AGENT_TRAIN_COST = 8000; // Training cost per session

const RISK_ENGINEERS = [
  { id: 'eng_deniz', name: 'Deniz Aydın', icon: '🔍', portrait: 'assets/eng_deniz.png', skillBase: 2, cost: 15000, trainCost: 10000, bio: 'Yeni sertifikalı. Temel kontrolleri yapabilir.' },
  { id: 'eng_baris', name: 'Barış Özkan', icon: '🛡️', portrait: 'assets/eng_baris.png', skillBase: 4, cost: 35000, trainCost: 12000, bio: '15 yıl deneyimli uzman. Detaylı analiz yapar.' },
];

// ── Helpers ──
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmtMoney = n => (n < 0 ? '-' : '') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
const fmtMoneyS = n => {
  const absN = Math.abs(n);
  const val = absN >= 1e6 ? '$' + (absN / 1e6).toFixed(1) + 'M' : absN >= 1000 ? '$' + Math.round(absN / 1000) + 'K' : '$' + Math.round(absN);
  return (n < 0 ? '-' : '') + val;
};
const riskColor = r => r >= 70 ? 'var(--risk-critical)' : r >= 50 ? 'var(--risk-high)' : r >= 30 ? 'var(--risk-medium)' : 'var(--risk-low)';
const riskLevel = r => r >= 70 ? 'KRİTİK' : r >= 50 ? 'YÜKSEK' : r >= 30 ? 'ORTA' : 'DÜŞÜK';

// ══════════════════════════════════════════
// SOUND MANAGER (Web Audio API - 8-bit)
// ══════════════════════════════════════════
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmOsc = null;
    this.bgmGain = null;
    this.bgmInterval = null;
    this.bgmStep = 0;
    this.bgmTempo = 250; // ms per step
  }
  init() { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.enabled = false; } }
  play(type) {
    if (!this.enabled || !this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    const t = this.ctx.currentTime;
    switch (type) {
      case 'click': o.frequency.setValueAtTime(800, t); o.frequency.setValueAtTime(600, t + .05); g.gain.setValueAtTime(.15, t); g.gain.exponentialRampToValueAtTime(.001, t + .1); o.type = 'square'; o.start(t); o.stop(t + .1); break;
      case 'accept': o.frequency.setValueAtTime(523, t); o.frequency.setValueAtTime(659, t + .08); o.frequency.setValueAtTime(784, t + .16); g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.type = 'square'; o.start(t); o.stop(t + .3); break;
      case 'reject': o.frequency.setValueAtTime(400, t); o.frequency.setValueAtTime(300, t + .1); g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .2); o.type = 'sawtooth'; o.start(t); o.stop(t + .2); break;
      case 'fire': o.frequency.setValueAtTime(200, t); o.frequency.linearRampToValueAtTime(80, t + .5); g.gain.setValueAtTime(.2, t); g.gain.exponentialRampToValueAtTime(.001, t + .6); o.type = 'sawtooth'; o.start(t); o.stop(t + .6); break;
      case 'money': o.frequency.setValueAtTime(1000, t); o.frequency.setValueAtTime(1200, t + .05); o.frequency.setValueAtTime(1400, t + .1); g.gain.setValueAtTime(.1, t); g.gain.exponentialRampToValueAtTime(.001, t + .2); o.type = 'square'; o.start(t); o.stop(t + .2); break;
      case 'badge': o.frequency.setValueAtTime(660, t); o.frequency.setValueAtTime(880, t + .1); o.frequency.setValueAtTime(1100, t + .2); o.frequency.setValueAtTime(1320, t + .3); g.gain.setValueAtTime(.1, t); g.gain.exponentialRampToValueAtTime(.001, t + .5); o.type = 'square'; o.start(t); o.stop(t + .5); break;
      case 'quarter': o.frequency.setValueAtTime(440, t); o.frequency.setValueAtTime(550, t + .1); o.frequency.setValueAtTime(660, t + .2); g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .4); o.type = 'triangle'; o.start(t); o.stop(t + .4); break;
      case 'cash_up': o.frequency.setValueAtTime(880, t); o.frequency.setValueAtTime(1760, t + .05); g.gain.setValueAtTime(.1, t); g.gain.exponentialRampToValueAtTime(.001, t + .15); o.type = 'sine'; o.start(t); o.stop(t + .15); break;
      case 'rank_up': o.frequency.setValueAtTime(330, t); o.frequency.setValueAtTime(440, t + .1); o.frequency.setValueAtTime(554, t + .2); o.frequency.setValueAtTime(659, t + .3); g.gain.setValueAtTime(.1, t); g.gain.exponentialRampToValueAtTime(.001, t + .5); o.type = 'square'; o.start(t); o.stop(t + .5); break;
      case 'warning': o.frequency.setValueAtTime(300, t); o.frequency.setValueAtTime(200, t + .2); o.frequency.setValueAtTime(300, t + .4); g.gain.setValueAtTime(.15, t); g.gain.exponentialRampToValueAtTime(.001, t + .6); o.type = 'sawtooth'; o.start(t); o.stop(t + .6); break;
    }
  }

  startBgm() {
    if (!this.enabled || !this.ctx || this.bgmInterval) return;
    const bassSeq = [110, 0, 110, 110, 0, 130, 0, 110]; // A2, -, A2, A2, -, C3, -, A2
    this.bgmInterval = setInterval(() => {
      if (this.ctx.state === 'suspended') return;
      const freq = bassSeq[this.bgmStep % bassSeq.length];
      this.bgmStep++;
      if (freq > 0) {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.03, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.stop(this.ctx.currentTime + 0.15);
      }
    }, this.bgmTempo);
  }

  updateBgm(cash) {
    if (!this.bgmInterval) return;
    // Speed up if broke, slow down/chill if rich
    if (cash < 0) this.bgmTempo = 150; // Hectic
    else if (cash < 250000) this.bgmTempo = 220; // Tense
    else this.bgmTempo = 300; // Relaxed

    clearInterval(this.bgmInterval);
    this.bgmInterval = null;
    this.startBgm();
  }
}

// ══════════════════════════════════════════
// VISUAL EFFECTS (Game Juice)
// ══════════════════════════════════════════
class VFX {
  static floatText(text, containerId, isPositive = true) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = `floating-text ${isPositive ? 'floating-positive' : 'floating-negative'}`;
    el.textContent = (isPositive ? '+' : '') + text;
    // Spawn roughly in the center of the target element
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  static shake(intensity = 'normal') {
    const screen = document.getElementById('game-screen') || document.body;
    screen.classList.remove('shake');
    // Force reflow
    void screen.offsetWidth;
    screen.classList.add('shake');
    setTimeout(() => screen.classList.remove('shake'), 400);
  }
}

// ══════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════
class GameState {
  constructor() { this.reset(); }
  reset() {
    this.companyName = 'FIRE INSURANCE';
    this.cash = 200000;
    this.monthlyIncome = 0; // Removed for balance — premiums are the only income
    this.fireMultiplier = 1.0;
    this.month = 1;
    this.totalPremium = 0;
    this.totalClaims = 0;
    this.totalFires = 0;
    this.ytdPremium = 0;
    this.ytdClaims = 0;
    this.prevYearLossRatio = 0;
    this.clients = [];
    this.portfolio = [];
    this.pendingClients = [];
    this.selectedClientId = null;
    this.eventLog = [];
    this.monthFires = [];
    this.pendingFireEvents = [];
    this.isGameOver = false;
    this.clientIdCounter = 0;
    this.satisfaction = 70; // 0-100
    this.hasReinsurance = false;
    this.reinsuranceCap = 0;
    this.achievements = {};
    this.upgrades = []; // Array of purchased upgrade ids
    this.chartData = []; // {q, premium, claims}

    // Agent system
    this.agents = [];           // Hired agents: { ...agentData, skill, loyalty, monthsActive, clientsBrought }
    this.availableAgents = [];  // Agents available for hire
    this.totalCommission = 0;   // Total commission paid out
    this._initAgentPool();

    // Risk Engineer
    this.riskEngineer = null;         // Active risk engineer: { ...data, skill }
    this.availableEngineers = RISK_ENGINEERS.map(e => ({ ...e }));

    // Competitor state - Asymmetric market established
    this.competitors = COMPETITORS.map((c, i) => {
      let premium = 0; let claims = 0; let cash = 500000; let policies = 0;
      if (i < 3) { // Top 3 Giants
        premium = randInt(1500000, 2500000);
        claims = Math.round(premium * (0.3 + Math.random() * 0.2));
        cash = premium - claims + 500000;
        policies = randInt(50, 100);
      } else if (i === 8) { // Bottom 1 Struggling
        premium = randInt(200000, 400000);
        claims = Math.round(premium * (1.2 + Math.random() * 0.5));
        cash = premium - claims;
        policies = randInt(10, 20);
      } else { // Middle 5 Average
        premium = randInt(400000, 800000);
        claims = Math.round(premium * (0.6 + Math.random() * 0.3));
        cash = premium - claims + 200000;
        policies = randInt(20, 50);
      }
      return {
        ...c,
        profit: premium - claims,
        premium, claims, cash, policies, fires: Math.round(claims / 50000),
        ytdPremium: premium, ytdClaims: claims,
        prevYearLossRatio: premium > 0 ? Math.round((claims / premium) * 100) : 0,
        lossRatio: premium > 0 ? Math.round((claims / premium) * 100) : 0
      };
    });
  }

  _initAgentPool() {
    // Shuffle and make first 3 available immediately, rest unlock later
    const shuffled = [...AGENT_POOL].sort(() => Math.random() - 0.5);
    this.availableAgents = shuffled.slice(0, 3).map(a => ({ ...a }));
    this._reserveAgents = shuffled.slice(3).map(a => ({ ...a }));
  }

  unlockNextAgent() {
    if (this._reserveAgents && this._reserveAgents.length > 0) {
      this.availableAgents.push(this._reserveAgents.shift());
    }
  }
}

// ══════════════════════════════════════════
// DYNAMIC STORY EVENTS
// ══════════════════════════════════════════
const DYNAMIC_EVENTS = [
  {
    id: 'inflation_shock',
    execute: (state) => {
      let loss = Math.round(state.cash * 0.10);
      state.cash -= loss;
      return [
        { name: 'Sistem', portrait: 'assets/system.png', text: `EKONOMİK KRİZ: Enflasyon fırladı! İşletme giderleri kasadan ${fmtMoney(loss)} götürdü.` },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Kötü haber... Beklenmedik enflasyon artışı nedeniyle kasamız sarsıldı. Daha dikkatli prim fiyatlaması yapmalıyız.' }
      ];
    }
  },
  {
    id: 'summer_heat',
    execute: (state) => {
      state.fireMultiplier = 1.8;
      return [
        { name: 'Haber Bülteni', portrait: 'assets/system.png', text: 'Meteoroloji uyardı! Ülke genelinde aşırı sıcaklar ve kuraklık bekleniyor. Yangın riski kırmızı alarmda.' },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Hava tahminleri çok kötü. Bu ayki hasar frekansı normalin neredeyse iki katı olabilir!' }
      ];
    }
  },
  {
    id: 'government_grant',
    execute: (state) => {
      state.cash += 50000;
      return [
        { name: 'Sistem', portrait: 'assets/system.png', text: 'DEVLET TEŞVİĞİ: Sektöre 50,000$ hibe desteği sağlandı!' },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Harika bir haberim var! Devletin KOBİ sigorta destek fonundan bize pay çıktı. Bunu iyi değerlendirelim.' }
      ];
    }
  },
  {
    id: 'competitor_dumping',
    execute: (state) => {
      state.portfolio.forEach(c => c.satisfaction = Math.max(10, c.satisfaction - 15));
      return [
        { name: 'Kerem (Güven Sigorta)', portrait: 'assets/kerem.png', text: 'Piyasada fiyat kırmaya başlıyoruz. Müşterileriniz yakında size sırt çevirecek.' },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Rakiplerimiz pazar payı için primleri dibe çekti. Müşteri memnuniyetimiz genel olarak düştü!' }
      ];
    }
  },
  {
    id: 'safety_inspections',
    execute: (state) => {
      state.portfolio.forEach(c => c.risk = Math.max(5, c.risk - 10));
      return [
        { name: 'Haber Bülteni', portrait: 'assets/system.png', text: 'Sanayi Bakanlığı tüm sanayi tesislerinde sıkı yangın denetimlerine başladı.' },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Denetimler işe yarıyor! Portföyümüzdeki tesisler mecburi önlemler aldı, genel risk skorumuz düştü.' }
      ];
    }
  }
];

// ══════════════════════════════════════════
// CLIENT GENERATOR
// ══════════════════════════════════════════
function generateClient(state, isReferral = false) {
  const ft = pick(FACILITY_TYPES);
  const region = pick(REGIONS);
  let rMod = region.riskMod;
  // Apply Lobbying Upgrade
  if (state.upgrades.includes('regional_lobby') && rMod > 1) rMod = Math.max(1.0, rMod - 0.15);

  let risk = randInt(ft.riskRange[0], ft.riskRange[1]);
  risk = clamp(Math.round(risk * rMod), 5, 95);
  const basePrem = randInt(ft.premRange[0], ft.premRange[1]);
  const value = randInt(ft.valRange[0], ft.valRange[1]);
  const name = pick(COMPANY_NAMES) + ' ' + pick(COMPANY_SUFFIXES);
  const factors = RISK_FACTORS.map(rf => {
    const isGood = Math.random() > (risk / 100);
    return { ...rf, status: isGood ? 'good' : (Math.random() > .5 ? 'bad' : 'mid'), statusText: isGood ? rf.good : rf.bad };
  });
  state.clientIdCounter++;
  return {
    id: state.clientIdCounter, companyName: name, facilityType: ft, region, risk, originalRisk: risk, value, factors,
    portrait: pick(CLIENT_PORTRAITS),
    premiumTiers: { low: Math.round(basePrem * .7), normal: basePrem, high: Math.round(basePrem * 1.4) },
    selectedPremium: 'normal', selectedRecs: [], acceptedRecs: [], rejectedRecs: [],
    status: 'pending', hasFired: false, fireDamage: 0, satisfaction: 70, isReferral, renewCount: 0
  };
}

function generateClients(state, count) {
  const arr = [];
  // Apply PR Campaign Upgrade
  if (state.upgrades.includes('pr_campaign')) count += 1;

  // Check for referral bonus from satisfied customers
  let referrals = 0;
  state.portfolio.forEach(c => {
    if (c.satisfaction >= 80 && Math.random() < 0.25) referrals++;
  });
  for (let i = 0; i < count; i++) arr.push(generateClient(state));
  for (let i = 0; i < Math.min(referrals, 2); i++) {
    const ref = generateClient(state, true);
    ref.risk = clamp(ref.risk - 10, 5, 95); // Referrals tend to be better risks
    arr.push(ref);
  }
  arr.forEach(c => { state.clients.push(c); state.pendingClients.push(c); });
  return { newCount: count, refCount: Math.min(referrals, 2), clients: arr };
}

// ══════════════════════════════════════════
// COMPETITOR AI
// ══════════════════════════════════════════
function simulateCompetitors(state) {
  state.competitors.forEach(comp => {
    const newPolicies = randInt(0, 2);
    comp.policies += newPolicies;
    const mPrem = comp.policies * Math.floor(randInt(2000, 6000) / 12);
    comp.premium += mPrem;
    comp.ytdPremium += mPrem;
    comp.cash += mPrem;
    // Fire losses based on style (monthly chance)
    const fireChance = (comp.style === 'aggressive' ? 0.35 : comp.style === 'conservative' ? 0.15 : 0.25) / 3;
    let mClaims = 0;
    if (Math.random() < fireChance * state.fireMultiplier) {
      const loss = randInt(20000, 150000);
      mClaims += loss;
      comp.fires++;
    }
    if (comp.style === 'aggressive' && Math.random() < (0.2 / 3) * state.fireMultiplier) {
      mClaims += randInt(30000, 200000);
      comp.fires++;
    }
    comp.claims += mClaims;
    comp.ytdClaims += mClaims;
    comp.cash -= mClaims;
    comp.profit = comp.premium - comp.claims;

    // YTD Loss Ratio
    comp.lossRatio = comp.ytdPremium > 0 ? Math.round((comp.ytdClaims / comp.ytdPremium) * 100) : comp.prevYearLossRatio;

    if (state.month > 0 && state.month % 12 === 0) {
      comp.prevYearLossRatio = comp.lossRatio;
      comp.ytdPremium = 0;
      comp.ytdClaims = 0;
    }
  });
}

function getLeaderboard(state) {
  const pLr = state.ytdPremium > 0 ? Math.round((state.ytdClaims / state.ytdPremium) * 100) : state.prevYearLossRatio;
  const player = {
    name: state.companyName + ' (SEN)', icon: '🔥', isPlayer: true,
    profit: state.totalPremium - state.totalClaims,
    policies: state.portfolio.length,
    lossRatio: pLr
  };
  const all = [player, ...state.competitors.map(c => ({
    name: c.name, icon: c.icon, isPlayer: false,
    profit: c.profit, policies: c.policies, lossRatio: c.lossRatio
  }))];
  all.sort((a, b) => b.profit - a.profit);
  return all.map((item, i) => ({ ...item, rank: i + 1 }));
}

// ══════════════════════════════════════════
// CHART RENDERER
// ══════════════════════════════════════════
function renderChart(state) {
  const canvas = document.getElementById('perf-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = 160;
  ctx.clearRect(0, 0, w, h);
  const data = state.chartData;
  if (data.length === 0) { ctx.fillStyle = '#666688'; ctx.font = '14px VT323'; ctx.fillText('Grafik verisi yok...', w / 2 - 50, h / 2); return; }
  const maxVal = Math.max(...data.map(d => Math.max(d.premium, d.claims)), 1);
  const barW = Math.floor(w / (data.length * 3 + 1));
  const pad = 20;
  data.forEach((d, i) => {
    const x = pad + i * barW * 3;
    const pH = (d.premium / maxVal) * (h - 40);
    const cH = (d.claims / maxVal) * (h - 40);
    // Premium bar
    ctx.fillStyle = '#33ff66';
    ctx.fillRect(x, h - 20 - pH, barW - 2, pH);
    // Claims bar
    ctx.fillStyle = '#ff3344';
    ctx.fillRect(x + barW, h - 20 - cH, barW - 2, cH);
    // Label
    ctx.fillStyle = '#666688';
    ctx.font = '11px "Press Start 2P"';
    ctx.fillText('Ç' + (i + 1), x, h - 4);
  });
  // Legend
  ctx.fillStyle = '#33ff66'; ctx.fillRect(w - 140, 6, 10, 10);
  ctx.fillStyle = '#9999bb'; ctx.font = '11px VT323'; ctx.fillText('Prim', w - 126, 16);
  ctx.fillStyle = '#ff3344'; ctx.fillRect(w - 80, 6, 10, 10);
  ctx.fillStyle = '#9999bb'; ctx.fillText('Hasar', w - 66, 16);
}

// ══════════════════════════════════════════
// PARTICLE SYSTEM
// ══════════════════════════════════════════
function spawnFireParticles() {
  const container = document.getElementById('particles-container');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = pick(['🔥', '🔥', '💥', '⚡', '🧡', '❤️']);
    p.style.left = randInt(20, 80) + '%';
    p.style.top = randInt(20, 80) + '%';
    p.style.fontSize = randInt(12, 28) + 'px';
    p.style.setProperty('--dx', randInt(-100, 100) + 'px');
    p.style.setProperty('--dy', randInt(-150, -30) + 'px');
    container.appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
  // CRT glitch
  const g = document.getElementById('crt-glitch');
  g.classList.add('active');
  setTimeout(() => g.classList.remove('active'), 900);
}

// ══════════════════════════════════════════
// UI RENDERER
// ══════════════════════════════════════════
class UIRenderer {
  constructor(game) { this.game = game; }

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  updateTopBar() {
    const s = this.game.state;
    document.getElementById('stat-quarter').textContent = `${s.month}/${TOTAL_MONTHS}`;
    const cashEl = document.getElementById('stat-cash');
    cashEl.textContent = fmtMoney(s.cash);
    cashEl.style.color = s.cash < 0 ? 'var(--retro-red)' : '';
    document.getElementById('stat-policies').textContent = s.portfolio.length;
    const lr = s.ytdPremium > 0 ? Math.round((s.ytdClaims / s.ytdPremium) * 100) : s.prevYearLossRatio;
    const lrEl = document.getElementById('stat-lr');
    lrEl.textContent = lr + '%';
    lrEl.className = 'tb-stat-value ' + (lr > 70 ? 'bad' : '');
  }

  updatePortfolio() {
    const s = this.game.state;
    const profit = s.totalPremium - s.totalClaims;
    document.getElementById('ps-premium').textContent = fmtMoney(s.totalPremium);
    document.getElementById('ps-claims').textContent = fmtMoney(s.totalClaims);
    const pe = document.getElementById('ps-profit');
    pe.textContent = (profit >= 0 ? '+' : '') + fmtMoney(profit);
    pe.className = 'ps-value ' + (profit >= 0 ? '' : 'negative');
    document.getElementById('ps-active').textContent = s.portfolio.length;
    document.getElementById('ps-fires').textContent = s.totalFires;
  }

  renderClientList() {
    const c = document.getElementById('client-list');
    const s = this.game.state;
    if (s.pendingClients.length === 0 && s.portfolio.length === 0) {
      c.innerHTML = '<div class="no-clients">BAŞLAMAK İÇİN<br>⏩ ÇEYREK SONU<br>BUTONUNA BASIN</div>';
      return;
    }
    c.innerHTML = '';
    s.pendingClients.forEach(cl => c.appendChild(this.makeCard(cl)));
    s.portfolio.forEach(cl => c.appendChild(this.makeCard(cl)));
    document.getElementById('client-count').textContent = s.pendingClients.length + ' yeni / ' + s.portfolio.length + ' poliçe';
  }

  makeCard(cl) {
    const sel = cl.id === this.game.state.selectedClientId;
    const d = document.createElement('div');
    d.className = `client-card ${cl.status} ${sel ? 'selected' : ''}`;
    let badge = cl.status === 'insured' ? '<span class="client-badge badge-insured">SİGORTALI</span>'
      : cl.status === 'rejected' ? '<span class="client-badge badge-rejected">RED</span>'
        : cl.isReferral ? '<span class="client-badge badge-satisfied">🤝 REFERANS</span>'
          : '<span class="client-badge badge-new">YENİ</span>';
    if (cl.hasFired) badge += ' <span class="client-badge badge-fire">🔥</span>';
    if (cl.renewCount > 0) badge += ' <span class="client-badge badge-renewed">🔄 YENİLENDİ</span>';
    d.innerHTML = `<div class="client-header"><span class="client-icon">${cl.facilityType.icon}</span><div class="client-info"><h3>${cl.companyName}</h3><div class="client-type">${cl.facilityType.name}</div><div class="client-region">${cl.region.icon} ${cl.region.name}</div></div></div>
      <div class="risk-bar-wrap"><div class="risk-bar-track"><div class="risk-bar-fill" style="width:${cl.risk}%;background:${riskColor(cl.risk)}"></div></div><span class="risk-bar-label" style="color:${riskColor(cl.risk)}">${cl.risk}</span></div>
      <div class="client-meta"><span><span class="cm-label">Değer </span><span class="cm-value">${fmtMoneyS(cl.value)}</span></span><span><span class="cm-label">Prim </span><span class="cm-value">${fmtMoneyS(cl.premiumTiers.normal)}</span></span></div>${badge}`;
    d.addEventListener('click', () => this.game.selectClient(cl.id));
    return d;
  }

  renderDecisionPanel(cl) {
    const area = document.getElementById('decision-area');
    const btns = document.getElementById('decision-buttons');
    const negPanel = document.getElementById('negotiation-panel');
    if (negPanel) negPanel.style.display = 'none';
    if (!cl) { area.innerHTML = '<div class="no-selection"><div class="ns-icon">📂</div><div class="ns-text">SOLDAKİ LİSTEDEN<br>BİR MÜŞTERİ SEÇİN</div></div>'; btns.style.display = 'none'; return; }
    if (cl.status !== 'pending') { this.renderInsuredView(cl); btns.style.display = 'none'; return; }
    const rc = riskColor(cl.risk), rl = riskLevel(cl.risk);
    const visibleCount = this.game.getVisibleFactorCount();
    const hasEngineer = this.game.state.riskEngineer !== null;
    const engSkill = hasEngineer ? this.game.state.riskEngineer.skill : 0;

    // Risk score: hidden if no engineer
    const riskDisplay = hasEngineer
      ? `<div class="ri-value risk-score" style="color:${rc}">${cl.risk}/100 (${rl})</div>`
      : `<div class="ri-value risk-score" style="color:var(--text-muted)">???</div>`;

    let fireProbText = '';
    // Fire probability requires skill 5 AND risk_software upgrade
    if (engSkill >= 5 && this.game.state.upgrades.includes('risk_software')) {
      let prob = cl.risk >= 70 ? 0.15 + (cl.risk - 70) / 200 : cl.risk >= 40 ? 0.05 + (cl.risk - 40) / 200 : 0.02 + cl.risk / 800;
      prob = Math.round(prob * this.game.state.fireMultiplier * 100);
      fireProbText = `<div class="report-item"><div class="ri-label">YANGIN İHTİMALİ</div><div class="ri-value" style="color:var(--retro-orange)">%${prob}</div></div>`;
    }

    let factorsHtml = '';
    if (!hasEngineer) {
      factorsHtml = `<div class="eng-locked-banner">
        <div class="elb-icon">🔒</div>
        <div class="elb-text">RİSK MÜHENDİSİ GEREKLİ</div>
        <div class="elb-desc">Şirket Yönetimi'nden risk mühendisi işe alın.</div>
      </div>`;
    } else {
      const showRecs = engSkill >= 4;
      factorsHtml = cl.factors.map((f, i) => {
        if (i >= visibleCount) {
          return `<div class="report-risk-item locked-factor"><span class="rri-icon">🔒</span><span class="rri-name">${f.name}</span><span class="rri-status">KİLİTLİ</span></div>`;
        }
        let html = `<div class="report-risk-item"><span class="rri-icon">${f.icon}</span><span class="rri-name">${f.name}</span><span class="rri-status ${f.status}">${f.statusText}</span></div>`;
        if (showRecs && f.status !== 'good') {
          const rec = RECOMMENDATIONS.find(r => r.id === f.id);
          if (rec) {
            const on = cl.selectedRecs.includes(rec.id);
            html += `<div class="rec-item embedded-rec" data-rec="${rec.id}"><span class="rec-icon">⚙️</span><div class="rec-info"><div class="rec-name">Öneri: ${rec.name}</div><div class="rec-effect">Risk -${rec.reduction} | Kabul %${Math.round(rec.chance * 100)}</div></div><span class="rec-cost">${fmtMoney(rec.cost)}</span><div class="rec-toggle ${on ? 'active' : ''}" data-rt="${rec.id}"></div></div>`;
          }
        }
        return html;
      }).join('');
    }

    const factorTitle = hasEngineer
      ? `▼ RİSK FAKTÖRLERİ ${visibleCount < 8 ? `(${visibleCount}/${cl.factors.length})` : '& ÖNERİLER'}`
      : '▼ RİSK FAKTÖRLERİ';

    area.innerHTML = `<div class="risk-report"><div class="report-header">📊 RİSK RAPORU — ${cl.companyName}</div>
      <div class="report-grid"><div class="report-item"><div class="ri-label">TESİS</div><div class="ri-value">${cl.facilityType.icon} ${cl.facilityType.name}</div></div>
      <div class="report-item"><div class="ri-label">RİSK</div>${riskDisplay}</div>
      <div class="report-item"><div class="ri-label">DEĞER</div><div class="ri-value">${fmtMoney(cl.value)}</div></div>
      <div class="report-item"><div class="ri-label">BÖLGE</div><div class="ri-value">${cl.region.icon} ${cl.region.name}</div></div>
      ${fireProbText}</div>
      <div class="report-risk-title">${factorTitle}</div>
      <div class="factors-list">${factorsHtml}</div></div>
    <div class="premium-section" style="margin-bottom:0;"><div class="section-title amber">💰 PRİM SEVİYESİ</div><div class="premium-options" id="prem-opts">
      ${['low', 'normal', 'high'].map(t => `<div class="premium-btn ${cl.selectedPremium === t ? 'selected' : ''}" data-tier="${t}"><div class="pb-label">${t === 'low' ? 'DÜŞÜK' : t === 'normal' ? 'NORMAL' : 'YÜKSEK'}</div><div class="pb-amount">${fmtMoney(cl.premiumTiers[t])}</div></div>`).join('')}</div></div>`;

    area.querySelectorAll('.premium-btn').forEach(b => b.addEventListener('click', () => {
      cl.selectedPremium = b.dataset.tier;
      area.querySelectorAll('.premium-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      this.game.sound.play('click');
    }));
    area.querySelectorAll('.rec-toggle').forEach(t => t.addEventListener('click', () => {
      const id = t.dataset.rt, idx = cl.selectedRecs.indexOf(id);
      if (idx >= 0) { cl.selectedRecs.splice(idx, 1); t.classList.remove('active'); } else { cl.selectedRecs.push(id); t.classList.add('active'); }
      this.game.sound.play('click');
    }));
    btns.style.display = 'flex';
  }

  renderInsuredView(cl) {
    const area = document.getElementById('decision-area');
    const rc = riskColor(cl.risk);
    let recHtml = '';
    if (cl.acceptedRecs.length) { recHtml += '<div class="report-risk-title" style="margin-top:8px">✅ KABUL EDİLEN</div>'; cl.acceptedRecs.forEach(id => { const r = RECOMMENDATIONS.find(x => x.id === id); if (r) recHtml += `<div class="report-risk-item"><span class="rri-icon">${r.icon}</span><span class="rri-name">${r.name}</span><span class="rri-status good">KABUL</span></div>`; }); }
    if (cl.rejectedRecs.length) { recHtml += '<div class="report-risk-title" style="margin-top:8px">❌ REDDEDİLEN</div>'; cl.rejectedRecs.forEach(id => { const r = RECOMMENDATIONS.find(x => x.id === id); if (r) recHtml += `<div class="report-risk-item"><span class="rri-icon">${r.icon}</span><span class="rri-name">${r.name}</span><span class="rri-status bad">RED</span></div>`; }); }
    area.innerHTML = `<div class="risk-report"><div class="report-header">${cl.facilityType.icon} ${cl.companyName}</div>
      <div class="report-grid"><div class="report-item"><div class="ri-label">RİSK</div><div class="ri-value risk-score" style="color:${rc}">${cl.risk}/100</div></div>
      <div class="report-item"><div class="ri-label">PRİM</div><div class="ri-value">${cl.status === 'insured' ? fmtMoney(cl.premiumTiers[cl.selectedPremium]) : 'N/A'}</div></div>
      <div class="report-item"><div class="ri-label">BÖLGE</div><div class="ri-value">${cl.region.icon} ${cl.region.name}</div></div>
      <div class="report-item"><div class="ri-label">DURUM</div><div class="ri-value" style="color:${cl.hasFired ? 'var(--retro-red)' : 'var(--crt-green)'}">${cl.hasFired ? '🔥 YANGIN GEÇMİŞİ' : '✅ AKTİF'}</div></div></div>
      ${recHtml}</div>`;
  }

  renderAchievements() {
    const bar = document.getElementById('achievements-bar');
    bar.innerHTML = ACHIEVEMENTS.map(a => {
      const unlocked = this.game.state.achievements[a.id];
      return `<div class="ach-badge ${unlocked ? 'unlocked' : ''}" title="${a.name}: ${a.desc}">${a.icon}</div>`;
    }).join('');
  }

  renderUpgrades() {
    const grid = document.getElementById('upgrades-grid');
    if (!grid) return;
    const s = this.game.state;
    grid.innerHTML = UPGRADES.map(u => {
      const purchased = s.upgrades.includes(u.id);
      const canAfford = s.cash >= u.cost;
      return `<div class="ug-card ${purchased ? 'purchased' : !canAfford ? 'disabled' : ''}">
        ${purchased ? '<div class="ug-status">✅</div>' : ''}
        <div class="ug-icon">${u.icon}</div>
        <div class="ug-name">${u.name}</div>
        <div class="ug-desc">${u.desc}</div>
        ${!purchased ? `<button class="btn-retro ${canAfford ? 'btn-green' : ''} ug-buy-btn" data-uid="${u.id}">${canAfford ? 'SATIN AL' : 'YETERSİZ NAKİT'} — ${fmtMoneyS(u.cost)}</button>` : `<button class="btn-retro ug-buy-btn" disabled>SAHİP OLUNDU</button>`}
      </div>`;
    }).join('');

    grid.querySelectorAll('.ug-buy-btn').forEach(b => {
      if (b.disabled || !b.dataset.uid) return;
      b.addEventListener('click', () => this.game.buyUpgrade(b.dataset.uid));
    });

    // Also render agents when office view updates
    this.renderAgents();
  }

  renderAgents() {
    const s = this.game.state;
    const agentGrid = document.getElementById('agents-grid');
    const hireGrid = document.getElementById('agent-hire-grid');
    if (!agentGrid || !hireGrid) return;

    // Active agents
    if (s.agents.length === 0) {
      agentGrid.innerHTML = '<div class="agent-empty">Henüz acente işe almadınız. Aşağıdan birini seçin.</div>';
    } else {
      agentGrid.innerHTML = s.agents.map(a => {
        const stars = '⭐'.repeat(a.skill) + '☆'.repeat(5 - a.skill);
        const loyaltyColor = a.loyalty >= 70 ? 'var(--retro-green)' : a.loyalty >= 40 ? 'var(--retro-amber)' : 'var(--retro-red)';
        const facilityType = FACILITY_TYPES.find(f => f.type === a.specialty);
        const specialtyName = facilityType ? facilityType.name : a.specialty;
        const canTrain = a.skill < 5 && s.cash >= AGENT_TRAIN_COST;
        return `<div class="agent-card">
          <div class="ag-header">
            <span class="ag-icon">${a.icon}</span>
            <div class="ag-name">${a.name}</div>
          </div>
          <div class="ag-stats">
            <div class="ag-stat"><span class="ag-label">Beceri</span><span class="ag-val">${stars}</span></div>
            <div class="ag-stat"><span class="ag-label">Sadakat</span><span class="ag-val" style="color:${loyaltyColor}">${a.loyalty}/100</span></div>
            <div class="ag-stat"><span class="ag-label">Komisyon</span><span class="ag-val">%${Math.round(a.commissionRate * 100)}</span></div>
            <div class="ag-stat"><span class="ag-label">Uzmanlık</span><span class="ag-val">${specialtyName}</span></div>
            <div class="ag-stat"><span class="ag-label">Getirilen</span><span class="ag-val">${a.clientsBrought} müşteri</span></div>
          </div>
          <div class="ag-loyalty-bar"><div class="ag-loyalty-fill" style="width:${a.loyalty}%;background:${loyaltyColor}"></div></div>
          <div class="ag-actions">
            <button class="btn-retro btn-green ag-train-btn ${!canTrain ? 'disabled' : ''}" data-aid="${a.id}" ${!canTrain ? 'disabled' : ''}>📚 Eğit (${fmtMoneyS(AGENT_TRAIN_COST)})</button>
            <button class="btn-retro btn-red ag-fire-btn" data-aid="${a.id}">👋 Ayır</button>
          </div>
        </div>`;
      }).join('');

      agentGrid.querySelectorAll('.ag-train-btn').forEach(b => {
        if (b.disabled) return;
        b.addEventListener('click', () => this.game.trainAgent(b.dataset.aid));
      });
      agentGrid.querySelectorAll('.ag-fire-btn').forEach(b => {
        b.addEventListener('click', () => this.game.fireAgent(b.dataset.aid));
      });
    }

    // Available agents for hire
    if (s.availableAgents.length === 0) {
      hireGrid.innerHTML = '<div class="agent-empty">Şu an müsait acente yok. Yeni acenteler zamanla açılacak.</div>';
    } else {
      const canAfford = s.cash >= AGENT_HIRE_COST;
      hireGrid.innerHTML = s.availableAgents.map(a => {
        const stars = '⭐'.repeat(a.skillBase) + '☆'.repeat(5 - a.skillBase);
        const facilityType = FACILITY_TYPES.find(f => f.type === a.specialty);
        const specialtyName = facilityType ? facilityType.name : a.specialty;
        return `<div class="agent-card agent-hire">
          <div class="ag-header">
            <span class="ag-icon">${a.icon}</span>
            <div class="ag-name">${a.name}</div>
          </div>
          <div class="ag-bio">${a.bio}</div>
          <div class="ag-stats">
            <div class="ag-stat"><span class="ag-label">Beceri</span><span class="ag-val">${stars}</span></div>
            <div class="ag-stat"><span class="ag-label">Sadakat</span><span class="ag-val">${a.loyaltyBase}/100</span></div>
            <div class="ag-stat"><span class="ag-label">Komisyon</span><span class="ag-val">%${Math.round(a.commissionRate * 100)}</span></div>
            <div class="ag-stat"><span class="ag-label">Uzmanlık</span><span class="ag-val">${specialtyName}</span></div>
          </div>
          <button class="btn-retro ${canAfford ? 'btn-green' : ''} ag-hire-btn" data-aid="${a.id}" ${!canAfford ? 'disabled' : ''}>${canAfford ? 'İŞE AL' : 'YETERSİZ NAKİT'} — ${fmtMoneyS(AGENT_HIRE_COST)}</button>
        </div>`;
      }).join('');

      hireGrid.querySelectorAll('.ag-hire-btn').forEach(b => {
        if (b.disabled) return;
        b.addEventListener('click', () => this.game.hireAgent(b.dataset.aid));
      });
    }

    // Also render engineer section
    this.renderEngineer();
  }

  renderEngineer() {
    const s = this.game.state;
    const section = document.getElementById('engineer-section');
    if (!section) return;

    if (s.riskEngineer) {
      const eng = s.riskEngineer;
      const stars = '⭐'.repeat(eng.skill) + '☆'.repeat(5 - eng.skill);
      const canTrain = eng.skill < 5 && s.cash >= eng.trainCost;
      const skillLabels = ['—', 'Stajyer', 'Junior', 'Orta', 'Uzman', 'Baş Mühendis'];
      section.innerHTML = `<div class="eng-card active">
        <div class="eng-header">
          <img src="${eng.portrait}" class="eng-portrait" alt="${eng.name}">
          <div class="eng-info">
            <div class="eng-name">${eng.name}</div>
            <div class="eng-level">${skillLabels[eng.skill]} — ${stars}</div>
          </div>
        </div>
        <div class="eng-details">
          <div class="eng-detail"><span class="ed-label">Seviye</span><span class="ed-val">${eng.skill}/5</span></div>
          <div class="eng-detail"><span class="ed-label">Görünen Faktör</span><span class="ed-val">${this.game.getVisibleFactorCount()}/8</span></div>
          <div class="eng-detail"><span class="ed-label">Eğitim Ücreti</span><span class="ed-val">${fmtMoneyS(eng.trainCost)}</span></div>
        </div>
        <div class="eng-skill-preview">
          <div class="esp-title">Beceri Açılımları:</div>
          <div class="esp-item ${eng.skill >= 1 ? 'unlocked' : ''}">Sv.1-2: Temel risk faktörleri (2-3)</div>
          <div class="esp-item ${eng.skill >= 3 ? 'unlocked' : ''}">Sv.3: Detaylı analiz (5 faktör)</div>
          <div class="esp-item ${eng.skill >= 4 ? 'unlocked' : ''}">Sv.4: Tam rapor + öneriler</div>
          <div class="esp-item ${eng.skill >= 5 ? 'unlocked' : ''}">Sv.5: Yangın olasılığı (%)</div>
        </div>
        <div class="ag-actions">
          <button class="btn-retro btn-green eng-train-btn ${!canTrain ? 'disabled' : ''}" ${!canTrain ? 'disabled' : ''}>📚 Eğit (${fmtMoneyS(eng.trainCost)})</button>
          <button class="btn-retro btn-red eng-fire-btn">👋 Ayır</button>
        </div>
      </div>`;

      const trainBtn = section.querySelector('.eng-train-btn');
      if (trainBtn && !trainBtn.disabled) trainBtn.addEventListener('click', () => this.game.trainEngineer());
      const fireBtn = section.querySelector('.eng-fire-btn');
      if (fireBtn) fireBtn.addEventListener('click', () => this.game.fireEngineer());
    } else if (s.availableEngineers.length > 0) {
      section.innerHTML = `<div class="eng-hire-grid">${s.availableEngineers.map(e => {
        const stars = '⭐'.repeat(e.skillBase) + '☆'.repeat(5 - e.skillBase);
        const canAfford = s.cash >= e.cost;
        return `<div class="eng-card eng-hire">
          <div class="eng-header">
            <img src="${e.portrait}" class="eng-portrait" alt="${e.name}">
            <div class="eng-info">
              <div class="eng-name">${e.name}</div>
              <div class="eng-level">${stars}</div>
            </div>
          </div>
          <div class="eng-bio">${e.bio}</div>
          <div class="eng-details">
            <div class="eng-detail"><span class="ed-label">Seviye</span><span class="ed-val">${e.skillBase}/5</span></div>
            <div class="eng-detail"><span class="ed-label">Eğitim Ücreti</span><span class="ed-val">${fmtMoneyS(e.trainCost)}</span></div>
          </div>
          <button class="btn-retro ${canAfford ? 'btn-green' : ''} eng-hire-btn" data-eid="${e.id}" ${!canAfford ? 'disabled' : ''}>${canAfford ? 'İŞE AL' : 'YETERSİZ NAKİT'} — ${fmtMoneyS(e.cost)}</button>
        </div>`;
      }).join('')}</div>`;

      section.querySelectorAll('.eng-hire-btn').forEach(b => {
        if (b.disabled) return;
        b.addEventListener('click', () => this.game.hireEngineer(b.dataset.eid));
      });
    } else {
      section.innerHTML = '<div class="agent-empty">Tüm mühendisler işe alındı.</div>';
    }
  }

  addLog(icon, text, type = '') {
    const s = this.game.state;
    const el = document.getElementById('event-log');
    const d = document.createElement('div');
    d.className = 'event-item';
    d.innerHTML = `<span class="ev-icon">${icon}</span><span class="ev-quarter">A${s.month}</span><span class="ev-text ${type}">${text}</span>`;
    el.insertBefore(d, el.firstChild);
  }

  toast(msg, type = 'amber', icon = 'ℹ️') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('toast-out'); setTimeout(() => t.remove(), 300); }, 2500);
  }

  showFireModal(cl, damage, claim) {
    document.getElementById('fire-facility').textContent = `${cl.facilityType.icon} ${cl.companyName}`;
    document.getElementById('fire-damage').textContent = `-${fmtMoney(damage)}`;
    document.getElementById('fire-claim').textContent = fmtMoney(claim);
    document.getElementById('fire-modal').classList.add('active');
  }

  showQuarterReport(monthLabel) {
    const s = this.game.state;
    // Calculate 3 months (quarterly) premium
    const qPrem = s.portfolio.reduce((sum, c) => sum + Math.round(c.premiumTiers[c.selectedPremium] / 4), 0);
    const qClaims = s.monthFires.reduce((sum, f) => sum + f.claim, 0);
    const qProfit = qPrem - qClaims;
    document.getElementById('qm-title').textContent = `📊 ÇEYREK DEĞERLENDİRMESİ`;
    document.getElementById('qm-subtitle').textContent = `Ay ${s.month}/${TOTAL_MONTHS}`;
    document.getElementById('qm-stats').innerHTML = `
      <div class="qm-stat"><div class="qs-label">SON 3 AY PRİMİ</div><div class="qs-value profit">+${fmtMoney(qPrem)}</div></div>
      <div class="qm-stat"><div class="qs-label">SON 3 AY HASARI</div><div class="qs-value ${qClaims ? 'loss' : ''}">${qClaims ? '-' : ''}${fmtMoney(qClaims)}</div></div>
      <div class="qm-stat"><div class="qs-label">KÂR/ZARAR</div><div class="qs-value ${qProfit >= 0 ? 'profit' : 'loss'}">${qProfit >= 0 ? '+' : ''}${fmtMoney(qProfit)}</div></div>
      <div class="qm-stat"><div class="qs-label">AKTİF POLİÇE</div><div class="qs-value">${s.portfolio.length}</div></div>`;
    const firesEl = document.getElementById('qm-fires');
    if (s.monthFires.length) {
      firesEl.innerHTML = `<div class="qm-section-title fire-c">🔥 YANGINLAR</div>${s.monthFires.map(f => `<div class="qm-fire-item"><span>${f.client.facilityType.icon}</span><span style="flex:1;color:var(--text-secondary)">${f.client.companyName}</span><span style="color:var(--retro-red);font-family:var(--font-pixel);font-size:.35rem">-${fmtMoney(f.claim)}</span></div>`).join('')}`;
    } else firesEl.innerHTML = '<div class="qm-no-fires">✅ Yangın çıkmadı!</div>';
    // Leaderboard
    const lb = getLeaderboard(s);
    document.getElementById('qm-leaderboard').innerHTML = `<div class="qm-section-title rank-c" style="margin-top:12px">🏆 SIRALAMA</div><div class="leaderboard-scroll">${lb.map(l => `<div class="lb-item ${l.isPlayer ? 'lb-you' : ''}"><span class="lb-rank">#${l.rank}</span><span class="lb-name">${l.icon} ${l.name}</span><span class="lb-score" style="color:${l.profit < 0 ? 'var(--retro-red)' : 'inherit'}">${fmtMoney(l.profit)}</span><span class="lb-ratio" style="color:${l.lossRatio > 70 ? 'var(--retro-red)' : 'var(--text-muted)'}">${l.lossRatio}%</span></div>`).join('')}</div>`;
    document.getElementById('quarter-modal').classList.add('active');
  }

  renderGameOver() {
    const s = this.game.state;
    const profit = s.totalPremium - s.totalClaims;
    const lr = s.ytdPremium > 0 ? Math.round((s.ytdClaims / s.ytdPremium) * 100) : s.prevYearLossRatio;
    let grade, sub;
    if (profit > 200000 && lr < 40) { grade = 'S'; sub = '🌟 Efsanevi portföy yönetimi!'; }
    else if (profit > 100000 && lr < 60) { grade = 'A'; sub = '🏆 Harika performans!'; }
    else if (profit > 0 && lr < 70) { grade = 'B'; sub = '👍 Kârlı ama geliştirilebilir.'; }
    else if (profit > -50000) { grade = 'C'; sub = '📊 Ortalama performans.'; }
    else { grade = 'F'; sub = '💀 Şirket zor durumda!'; }
    document.getElementById('go-subtitle').textContent = sub;
    const ge = document.getElementById('go-grade');
    ge.textContent = grade; ge.className = 'go-grade grade-' + grade;
    document.getElementById('gos-profit').textContent = (profit >= 0 ? '+' : '') + fmtMoney(profit);
    document.getElementById('gos-policies').textContent = s.portfolio.length;
    document.getElementById('gos-fires').textContent = s.totalFires;
    document.getElementById('gos-ratio').textContent = lr + '%';
    const lb = getLeaderboard(s);
    document.getElementById('go-leaderboard').innerHTML = `<div class="qm-section-title rank-c" style="text-align:center;margin-top:12px">🏆 FİNAL SIRALAMASI</div>${lb.map(l => `<div class="lb-item ${l.isPlayer ? 'lb-you' : ''}"><span class="lb-rank">#${l.rank}</span><span class="lb-name">${l.icon} ${l.name}</span><span class="lb-score" style="color:${l.profit < 0 ? 'var(--retro-red)' : 'inherit'}">${fmtMoney(l.profit)}</span><span class="lb-ratio" style="color:${l.lossRatio > 70 ? 'var(--retro-red)' : 'var(--text-muted)'}">${l.lossRatio}%</span></div>`).join('')}`;
  }

  updateAll() {
    this.updateTopBar();
    this.updatePortfolio();
    this.renderClientList();
    this.renderAchievements();
    this.renderUpgrades();
    renderChart(this.game.state);
  }
}

// ══════════════════════════════════════════
// STORY MANAGER (Visual Novel)
// ══════════════════════════════════════════
class StoryManager {
  constructor(game) {
    this.game = game;
    this.queue = [];
    this.isActive = false;
    this.isTyping = false;
    this.currentText = '';
    this.typeTimer = null;

    // Bind click to advance/skip
    document.getElementById('vn-overlay').addEventListener('click', () => this.advanceOrSkip());
  }

  playSequence(dialogs) {
    this.queue = this.queue.concat(dialogs);
    if (!this.isActive) this.dequeue();
  }

  dequeue() {
    if (this.queue.length === 0) {
      this.close();
      return;
    }

    this.isActive = true;
    document.getElementById('vn-overlay').style.display = 'flex';
    document.getElementById('vn-overlay').style.zIndex = '999999';
    document.getElementById('vn-continue').style.display = 'none';

    const d = this.queue.shift();
    const portEl = document.getElementById('vn-portrait');
    if (d.portrait && d.portrait.includes('.png')) {
      // Direct pixel art rendering over transparent background
      portEl.innerHTML = `<img src="${d.portrait}?v=${Date.now()}" style="width:120%; height:120%; object-fit:contain; display:block; image-rendering:pixelated; transform: translateY(-10px);" />`;
    } else {
      portEl.textContent = d.portrait || '👤';
    }
    document.getElementById('vn-name').textContent = d.name || 'BİLİNMEYEN';

    this.currentText = d.text;
    this.typeText();
  }

  typeText() {
    this.isTyping = true;
    const el = document.getElementById('vn-text');
    el.textContent = '';
    let i = 0;

    clearInterval(this.typeTimer);
    this.typeTimer = setInterval(() => {
      el.textContent += this.currentText.charAt(i);
      // Play a tiny blip sound every few chars or always
      if (i % 2 === 0 && this.currentText.charAt(i) !== ' ') {
        this.game.sound.play('click'); // Or a custom blip if available
      }
      i++;
      if (i >= this.currentText.length) {
        clearInterval(this.typeTimer);
        this.finishTyping();
      }
    }, 30); // typing speed
  }

  finishTyping() {
    this.isTyping = false;
    document.getElementById('vn-text').textContent = this.currentText;
    document.getElementById('vn-continue').style.display = 'block';
  }

  advanceOrSkip() {
    if (!this.isActive) return;
    if (this.isTyping) {
      // Skip typing
      clearInterval(this.typeTimer);
      this.finishTyping();
    } else {
      // Advance to next
      this.dequeue();
    }
  }

  close() {
    this.isActive = false;
    document.getElementById('vn-overlay').style.display = 'none';
    if (this.onClose) this.onClose();
  }
}

// ══════════════════════════════════════════
// GAME CONTROLLER
// ══════════════════════════════════════════
class Game {
  constructor() {
    this.state = new GameState();
    this.ui = new UIRenderer(this);
    this.sound = new SoundManager();
    this.story = new StoryManager(this);
    this.minigame = new MiniGame(this);

    // Story flags
    this.flags = { seenIntro: false, seenFirstFire: false, seenMidpoint: false };

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('next-quarter-btn').addEventListener('click', () => this.advanceMonth());
    document.getElementById('btn-accept').addEventListener('click', () => this.acceptClient());
    document.getElementById('btn-reject').addEventListener('click', () => this.rejectClient());
    document.getElementById('fire-dismiss').addEventListener('click', () => { document.getElementById('fire-modal').classList.remove('active'); this.processNextFire(); });
    document.getElementById('quarter-dismiss').addEventListener('click', () => {
      document.getElementById('quarter-modal').classList.remove('active');
      if (this.state.month >= TOTAL_MONTHS) this.endGame();
    });
    document.getElementById('replay-btn').addEventListener('click', () => { this.state.reset(); this.ui.showScreen('title-screen'); });
    // Negotiation events
    document.getElementById('neg-accept').addEventListener('click', () => this.resolveNegotiation('accept'));
    document.getElementById('neg-counter').addEventListener('click', () => this.resolveNegotiation('counter'));
    document.getElementById('neg-reject').addEventListener('click', () => this.resolveNegotiation('reject'));
    document.getElementById('neg-submit').addEventListener('click', () => this.submitCounterOffer());
    document.getElementById('neg-slider').addEventListener('input', (e) => {
      document.getElementById('neg-player-offer').textContent = fmtMoney(parseInt(e.target.value));
    });
    // Mobile & Desktop tab switching
    document.querySelectorAll('.mobile-tab, .desktop-tab').forEach(tab => tab.addEventListener('click', () => {
      this.switchTab(tab.dataset.tab);
      this.sound.play('click');
    }));
  }

  switchTab(tabName) {
    document.querySelectorAll('.mobile-tab, .desktop-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    const isMobile = window.innerWidth <= 768;
    const mainView = document.getElementById('view-main');
    const officeView = document.getElementById('view-office');

    if (tabName === 'office') {
      mainView.style.display = 'none';
      mainView.classList.remove('active-view');
      if (officeView) {
        officeView.style.display = 'flex';
        officeView.classList.add('mobile-active');
      }
      this.ui.renderUpgrades();
    } else {
      mainView.classList.add('active-view');
      mainView.style.display = isMobile ? 'flex' : 'grid';
      if (officeView) {
        officeView.style.display = 'none';
        officeView.classList.remove('mobile-active');
      }
    }

    // Mobile specific panel switching within view-main
    if (isMobile && tabName !== 'office') {
      document.querySelectorAll('[data-panel]').forEach(p => p.classList.toggle('mobile-active', p.dataset.panel === tabName));
    }
  }

  switchMobileTab(panelName) {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('[data-panel]').forEach(p => p.classList.toggle('mobile-active', p.dataset.panel === panelName));
    }
  }

  startGame() {
    this.sound.init();
    this.state.reset();

    // Read custom company name from input
    const nameInput = document.getElementById('company-name-input').value.trim();
    if (nameInput) {
      this.state.companyName = nameInput.substring(0, 20)
        .toLocaleLowerCase('tr-TR')
        .split(' ')
        .map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
        .join(' ');
    }

    // Update UI elements with the specific company name
    const topBrand = document.getElementById('topbar-company-name');
    if (topBrand) {
      topBrand.innerHTML = `<span class="brand-icon">🔥</span> ${this.state.companyName.toUpperCase()}`;
    }

    this.ui.showScreen('game-screen');
    this.switchMobileTab('clients'); // Initialize mobile view
    this.ui.updateAll();
    this.ui.addLog('🏁', `${this.state.companyName} açıldı! Rekabet seni bekliyor.`, 'ev-good');
    this.ui.toast('Oyun başladı!', 'green', '🏁');
    this.sound.play('accept');
    this.generateNewClients();
    document.getElementById('ticker-text').textContent = pick(TICKER_MSGS);

    // Reset flags
    this.flags = { seenIntro: false, seenFirstFire: false, seenMidpoint: false, usedCredit: false };

    // Trigger Intro Story LAST so it appears on top and pauses interaction
    setTimeout(() => {
      this.story.playSequence([
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: `${this.state.companyName} çatısı altına hoş geldin. Yangın sigortası piyasasında en dipten başlıyoruz. Rakiplerimiz dev gibi, biz ise sadece küçük bir ofisiz.` },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Bütçemiz kısıtlı. Doğru müşterileri seçmeli, riskleri iyi yönetmeli ve şirketi büyütmelisin. Yoksa batarız.' },
        { name: 'Kerem (Güven Sigorta)', portrait: 'assets/kerem.png', text: 'Yeni yetmeler... Bu piyasada ayakta kalabileceğinizi mi sanıyorsunuz? İlk yangında iflas edeceksiniz.' },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Onları dinleme. Listede bizi bekleyen ilk başvurular var. Dikkatli karar ver!' }
      ]);
    }, 500);
  }

  generateNewClients() {
    const result = generateClients(this.state, randInt(3, 5));
    this.ui.addLog('📋', `${result.newCount} yeni başvuru geldi.`, '');
    if (result.refCount > 0) {
      this.ui.addLog('🤝', `${result.refCount} referans müşteri! (Memnun müşterilerden)`, 'ev-good');
      this.ui.toast(`${result.refCount} referans müşteri!`, 'green', '🤝');
      this.checkAchievement('referral', 'referral');
    }
    this.ui.renderClientList();
  }

  // ══════════════════════════════════════════
  // AGENT SYSTEM
  // ══════════════════════════════════════════
  hireAgent(agentId) {
    const idx = this.state.availableAgents.findIndex(a => a.id === agentId);
    if (idx < 0) return;
    if (this.state.cash < AGENT_HIRE_COST) {
      this.ui.toast('Yetersiz nakit!', 'red', '💸');
      return;
    }
    const agentData = this.state.availableAgents.splice(idx, 1)[0];
    const agent = {
      ...agentData,
      skill: agentData.skillBase,
      loyalty: agentData.loyaltyBase,
      monthsActive: 0,
      clientsBrought: 0,
      totalCommissionEarned: 0
    };
    this.state.agents.push(agent);
    this.state.cash -= AGENT_HIRE_COST;

    VFX.floatText(fmtMoney(AGENT_HIRE_COST), 'topbar-cash', false);
    this.ui.addLog('🤝', `${agent.icon} ${agent.name} işe alındı! Komisyon: %${Math.round(agent.commissionRate * 100)}`, 'ev-good');
    this.ui.toast(`${agent.name} ekibe katıldı!`, 'green', '🤝');
    this.sound.play('accept');
    this.ui.renderUpgrades();
    this.ui.updateAll();
  }

  fireAgent(agentId) {
    const idx = this.state.agents.findIndex(a => a.id === agentId);
    if (idx < 0) return;
    const agent = this.state.agents.splice(idx, 1)[0];

    // Clients brought by this agent lose some satisfaction
    this.state.portfolio.forEach(cl => {
      if (cl.agentId === agent.id) {
        cl.satisfaction = Math.max(10, cl.satisfaction - 10);
      }
    });

    this.ui.addLog('👋', `${agent.icon} ${agent.name} ekipten ayrıldı.`, '');
    this.ui.toast(`${agent.name} ayrıldı`, 'red', '👋');
    this.sound.play('reject');
    this.ui.renderUpgrades();
    this.ui.updateAll();
  }

  trainAgent(agentId) {
    const agent = this.state.agents.find(a => a.id === agentId);
    if (!agent) return;
    if (this.state.cash < AGENT_TRAIN_COST) {
      this.ui.toast('Yetersiz nakit!', 'red', '💸');
      return;
    }
    if (agent.skill >= 5) {
      this.ui.toast('Maksimum beceri seviyesinde!', 'red', '⭐');
      return;
    }
    this.state.cash -= AGENT_TRAIN_COST;
    agent.skill = Math.min(5, agent.skill + 1);
    agent.loyalty = Math.min(100, agent.loyalty + 5);

    VFX.floatText(fmtMoney(AGENT_TRAIN_COST), 'topbar-cash', false);
    this.ui.addLog('📚', `${agent.icon} ${agent.name} eğitim tamamladı! Beceri: ${'⭐'.repeat(agent.skill)}`, 'ev-good');
    this.sound.play('badge');
    this.ui.renderUpgrades();
    this.ui.updateAll();
  }

  processAgentPhase() {
    if (this.state.agents.length === 0) return;

    let totalAgentClients = 0;
    this.state.agents.forEach(agent => {
      agent.monthsActive++;

      // Agent brings clients based on skill
      const clientChance = agent.skill >= 4 ? 0.75 : agent.skill >= 3 ? 0.55 : 0.35;
      const bringCount = Math.random() < clientChance ? (agent.skill >= 4 && Math.random() < 0.3 ? 2 : 1) : 0;

      for (let i = 0; i < bringCount; i++) {
        const cl = generateClient(this.state);
        // Specialty bonus: clients in agent's specialty have lower risk
        const specialtyMatch = cl.facilityType.type === agent.specialty;
        if (specialtyMatch) {
          cl.risk = clamp(cl.risk - 10, 5, 95);
        }
        cl.agentId = agent.id;
        cl.agentName = agent.name;
        cl.agentIcon = agent.icon;
        cl.agentCommission = agent.commissionRate;
        this.state.clients.push(cl);
        this.state.pendingClients.push(cl);
        agent.clientsBrought++;
        totalAgentClients++;
      }

      // Loyalty drift: small random changes
      const loyaltyDrift = randInt(-3, 2);
      agent.loyalty = clamp(agent.loyalty + loyaltyDrift, 10, 100);

      // Agent leaves if loyalty drops below 20
      if (agent.loyalty <= 20) {
        this.agentDeparture(agent);
      }
    });

    if (totalAgentClients > 0) {
      this.ui.addLog('👔', `Acenteler ${totalAgentClients} yeni müşteri getirdi.`, 'ev-good');
    }

    // Agent events: trigger once per 4 months on average
    if (this.state.agents.length > 0 && Math.random() < 0.25) {
      this.triggerAgentEvent();
    }

    // Unlock new agent every 6 months
    if (this.state.month % 6 === 0) {
      this.state.unlockNextAgent();
    }

    this.ui.renderClientList();
  }

  agentDeparture(agent) {
    const idx = this.state.agents.indexOf(agent);
    if (idx < 0) return;
    this.state.agents.splice(idx, 1);

    this.state.portfolio.forEach(cl => {
      if (cl.agentId === agent.id) cl.satisfaction = Math.max(10, cl.satisfaction - 8);
    });

    this.story.playSequence([
      { name: agent.name, portrait: agent.portrait, text: `Artık devam edemiyorum. Başka bir firmaya geçiyorum. Sizinle çalışmak güzeldi.` },
      { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: `${agent.name} bizi bırakıyor... Müşterilerine dikkat edelim, memnuniyetleri düşebilir.` }
    ]);
    this.ui.addLog('👋', `${agent.icon} ${agent.name} firmadan ayrıldı! (Düşük sadakat)`, 'ev-fire');
  }

  triggerAgentEvent() {
    const agent = pick(this.state.agents);
    const roll = Math.random();

    if (roll < 0.25) {
      // Commission demand
      const increase = Math.round(agent.commissionRate * 100) + 2;
      this.story.playSequence([
        { name: agent.name, portrait: agent.portrait, text: `Piyasada komisyon oranları yükseldi. Benim de oranımın %${increase}'e çıkmasını istiyorum.` }
      ]);
      this.story.onClose = () => {
        this.story.onClose = null;
        agent.commissionRate = Math.min(0.20, agent.commissionRate + 0.02);
        agent.loyalty = Math.min(100, agent.loyalty + 10);
        this.ui.addLog('💸', `${agent.icon} ${agent.name} komisyon oranı %${increase}'e yükseldi.`, '');
        this.ui.renderUpgrades();
      };
    } else if (roll < 0.45) {
      // Big client find
      const cl = generateClient(this.state);
      // Make it a premium client
      cl.value = Math.round(cl.value * 1.5);
      cl.premiumTiers.low = Math.round(cl.premiumTiers.low * 1.3);
      cl.premiumTiers.normal = Math.round(cl.premiumTiers.normal * 1.3);
      cl.premiumTiers.high = Math.round(cl.premiumTiers.high * 1.3);
      cl.agentId = agent.id;
      cl.agentName = agent.name;
      cl.agentIcon = agent.icon;
      cl.agentCommission = agent.commissionRate;
      if (cl.facilityType.type === agent.specialty) cl.risk = clamp(cl.risk - 15, 5, 95);
      this.state.clients.push(cl);
      this.state.pendingClients.push(cl);
      agent.clientsBrought++;
      this.story.playSequence([
        { name: agent.name, portrait: agent.portrait, text: `Büyük bir müşteri buldum! ${cl.facilityType.icon} ${cl.companyName} — değeri ${fmtMoney(cl.value)}. İlgilenin!` }
      ]);
      this.ui.addLog('⭐', `${agent.icon} ${agent.name} büyük müşteri getirdi: ${cl.companyName}`, 'ev-good');
    } else if (roll < 0.65) {
      // Performance/motivation drop
      agent.loyalty = Math.max(10, agent.loyalty - 10);
      this.story.playSequence([
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: `${agent.name} son zamanlarda biraz motivasyonsuz görünüyor. Eğitim ya da teşvik düşünmemiz lazım.` }
      ]);
      this.ui.addLog('📉', `${agent.icon} ${agent.name} motivasyonu düştü. Sadakat: ${agent.loyalty}`, '');
    } else if (roll < 0.80) {
      // Client communication issue
      const affectedClients = this.state.portfolio.filter(c => c.agentId === agent.id);
      if (affectedClients.length > 0) {
        affectedClients.forEach(c => c.satisfaction = Math.max(10, c.satisfaction - 5));
        this.story.playSequence([
          { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: `${agent.name}'in müşterilerinden şikayet geldi: "Sorularımıza geç dönülüyor." Müşteri memnuniyeti biraz düştü.` }
        ]);
        this.ui.addLog('😤', `${agent.icon} ${agent.name}: Müşteri iletişim sorunu. Satisfaction düştü.`, '');
      }
    } else {
      // Training request (positive opportunity)
      this.story.playSequence([
        { name: agent.name, portrait: agent.portrait, text: `Yeni bir sektör sertifika programı var. Katılırsam daha iyi müşteri bulabilirim. Onaylar mısınız?` }
      ]);
      agent.loyalty = Math.min(100, agent.loyalty + 3);
      this.ui.addLog('📚', `${agent.icon} ${agent.name} eğitim talep etti. Şirket Yönetimi'nden eğitim verebilirsiniz.`, '');
    }
  }

  collectAgentCommissions(monthlyPrem) {
    if (this.state.agents.length === 0) return 0;
    let totalCommission = 0;
    this.state.portfolio.forEach(cl => {
      if (!cl.agentCommission || cl.status !== 'insured') return;
      const monthPrem = Math.round(cl.premiumTiers[cl.selectedPremium] / 12);
      const comm = Math.round(monthPrem * cl.agentCommission);
      totalCommission += comm;
      // Track per-agent commission
      const agent = this.state.agents.find(a => a.id === cl.agentId);
      if (agent) agent.totalCommissionEarned += comm;
    });
    if (totalCommission > 0) {
      this.state.cash -= totalCommission;
      this.state.totalCommission += totalCommission;
      this.ui.addLog('💸', `Acente komisyonları: -${fmtMoney(totalCommission)}`, '');
    }
    return totalCommission;
  }

  // ══════════════════════════════════════════
  // RISK ENGINEER SYSTEM
  // ══════════════════════════════════════════
  hireEngineer(engId) {
    if (this.state.riskEngineer) {
      this.ui.toast('Zaten bir risk mühendisiniz var!', 'red', '⚠️');
      return;
    }
    const idx = this.state.availableEngineers.findIndex(e => e.id === engId);
    if (idx < 0) return;
    const engData = this.state.availableEngineers[idx];
    if (this.state.cash < engData.cost) {
      this.ui.toast('Yetersiz nakit!', 'red', '💸');
      return;
    }
    this.state.availableEngineers.splice(idx, 1);
    this.state.riskEngineer = {
      ...engData,
      skill: engData.skillBase,
      reportsCompleted: 0
    };
    this.state.cash -= engData.cost;

    VFX.floatText(fmtMoney(engData.cost), 'topbar-cash', false);
    this.ui.addLog('🔍', `${engData.name} risk mühendisi olarak işe alındı! Seviye: ${'⭐'.repeat(engData.skillBase)}`, 'ev-good');
    this.ui.toast(`${engData.name} ekibe katıldı!`, 'green', '🔍');
    this.sound.play('accept');
    this.ui.renderUpgrades();
    this.ui.updateAll();
  }

  fireEngineer() {
    if (!this.state.riskEngineer) return;
    const eng = this.state.riskEngineer;
    this.state.riskEngineer = null;

    this.ui.addLog('👋', `${eng.name} firmadan ayrıldı.`, '');
    this.ui.toast(`${eng.name} ayrıldı`, 'red', '👋');
    this.sound.play('reject');
    this.ui.renderUpgrades();
    this.ui.updateAll();
  }

  trainEngineer() {
    const eng = this.state.riskEngineer;
    if (!eng) return;
    if (this.state.cash < eng.trainCost) {
      this.ui.toast('Yetersiz nakit!', 'red', '💸');
      return;
    }
    if (eng.skill >= 5) {
      this.ui.toast('Maksimum seviyeye ulaştı!', 'red', '⭐');
      return;
    }
    this.state.cash -= eng.trainCost;
    eng.skill = Math.min(5, eng.skill + 1);

    VFX.floatText(fmtMoney(eng.trainCost), 'topbar-cash', false);
    this.ui.addLog('📚', `${eng.name} eğitim tamamladı! Seviye: ${'⭐'.repeat(eng.skill)}`, 'ev-good');
    this.sound.play('badge');
    this.ui.renderUpgrades();
    this.ui.updateAll();
  }

  getVisibleFactorCount() {
    const eng = this.state.riskEngineer;
    if (!eng) return 0;
    // Skill 1: 2 factors, 2: 3, 3: 5, 4+: all (8)
    if (eng.skill >= 4) return 8;
    if (eng.skill === 3) return 5;
    if (eng.skill === 2) return 3;
    return 2;
  }

  selectClient(id) {
    this.state.selectedClientId = id;
    const cl = this.state.clients.find(c => c.id === id);
    this.ui.renderDecisionPanel(cl);
    this.ui.renderClientList();
    this.sound.play('click');
    // Auto-switch to decision tab on mobile
    if (window.innerWidth <= 768) this.switchMobileTab('decision');
  }

  acceptClient() {
    const cl = this.state.clients.find(c => c.id === this.state.selectedClientId);
    if (!cl || cl.status !== 'pending') return;

    // Premium rejection mechanics
    let acceptChance = 1.0;
    if (cl.selectedPremium === 'normal') acceptChance = 0.8;
    if (cl.selectedPremium === 'high') acceptChance = 0.5;

    // Upgrades like sales team improve this
    if (this.state.upgrades.includes('sales_team')) {
      if (cl.selectedPremium === 'normal') acceptChance = 0.95;
      if (cl.selectedPremium === 'high') acceptChance = 0.7;
    }

    if (Math.random() > acceptChance) {
      // Instead of walking away, enter negotiation
      this.startNegotiation(cl);
      return;
    }

    // Process recommendations
    cl.selectedRecs.forEach(recId => {
      const rec = RECOMMENDATIONS.find(r => r.id === recId);
      if (!rec) return;
      if (Math.random() < rec.chance) {
        cl.acceptedRecs.push(recId);
        cl.risk = clamp(cl.risk - rec.reduction, 5, 95);
        cl.satisfaction += 5;
        this.ui.addLog(rec.icon, `${cl.companyName} "${rec.name}" KABUL ETTİ. Risk: -${rec.reduction}`, 'ev-good');
      } else {
        cl.rejectedRecs.push(recId);
        cl.satisfaction -= 10; // Severe penalty for not taking precautions
        this.ui.addLog('❌', `${cl.companyName} "${rec.name}" REDDETTİ.`, 'ev-fire');
      }
    });
    cl.status = 'insured';
    this.state.portfolio.push(cl);
    this.state.pendingClients = this.state.pendingClients.filter(c => c.id !== cl.id);
    const prem = cl.premiumTiers[cl.selectedPremium];

    // High premium reduces satisfaction (unless trained sales team upgrade is active)
    let satLoss = cl.selectedPremium === 'high' ? 10 : 0;
    if (cl.selectedPremium === 'high' && this.state.upgrades.includes('sales_team')) {
      satLoss = 3; // Sales team mitigates dissatisfaction
    }
    cl.satisfaction -= satLoss;
    if (cl.selectedPremium === 'low') cl.satisfaction += 5;

    this.ui.addLog('✅', `${cl.companyName} sigortalandı. Prim: ${fmtMoney(prem)}/yıl`, 'ev-good');
    this.ui.toast(`${cl.companyName} sigortalandı!`, 'green', '✅');
    this.sound.play('accept');
    this.state.selectedClientId = null;
    this.ui.renderDecisionPanel(null);
    document.getElementById('negotiation-panel').style.display = 'none';
    this.ui.updateAll();
    this.checkAllAchievements();
    // Auto-switch back to clients on mobile
    if (window.innerWidth <= 768) this.switchMobileTab('clients');
  }

  // ══════════════════════════════════════════
  // NEGOTIATION SYSTEM
  // ══════════════════════════════════════════
  startNegotiation(cl) {
    const originalPrem = cl.premiumTiers[cl.selectedPremium];

    // Calculate client's desired discount based on tier and risk
    const baseDiscount = cl.selectedPremium === 'high' ? 0.20 : 0.12;
    const riskFactor = (100 - cl.risk) / 300; // Lower risk clients negotiate less
    const discount = clamp(baseDiscount + (Math.random() * 0.08) - riskFactor, 0.05, 0.30);
    const counterOffer = Math.round(originalPrem * (1 - discount));

    // Store negotiation state on the client
    cl.negotiation = {
      originalPrem,
      clientOffer: counterOffer,
      discount: Math.round(discount * 100),
      round: 1,
      maxRounds: 2
    };

    this.sound.play('warning');

    // Show VN dialog first
    const dialogMessages = [
      `Bu fiyat bütçemizi aşıyor. En fazla ${fmtMoney(counterOffer)}/yıl ödeyebiliriz. Ne dersiniz?`,
      `${fmtMoney(originalPrem)} çok fazla. Size ${fmtMoney(counterOffer)}/yıl teklif ediyoruz.`,
      `Fiyatı biraz indirebilir misiniz? Bizim bütçemiz ${fmtMoney(counterOffer)}/yıl civarında.`,
      `Bu primi karşılayamayız. ${fmtMoney(counterOffer)}/yıl'a ne dersiniz?`
    ];

    this.story.playSequence([
      { name: cl.companyName, portrait: cl.portrait || pick(CLIENT_PORTRAITS), text: pick(dialogMessages) }
    ]);
    this.story.onClose = () => {
      this.story.onClose = null;
      this.showNegotiationPanel(cl);
    };
  }

  showNegotiationPanel(cl) {
    const neg = cl.negotiation;
    const panel = document.getElementById('negotiation-panel');
    const info = document.getElementById('neg-info');
    const offer = document.getElementById('neg-offer');

    // Hide decision buttons, show negotiation panel
    document.getElementById('decision-buttons').style.display = 'none';
    panel.style.display = 'block';

    info.innerHTML = `<strong>${cl.companyName}</strong> teklifinizi reddetti ve karşı teklif yaptı.` +
      `<br>Orijinal prim: ${fmtMoney(neg.originalPrem)}/yıl → İndirim: %${neg.discount}`;

    offer.innerHTML = `<div class="neg-offer-label">Müşterinin Teklifi</div>` +
      `<div class="neg-offer-amount">${fmtMoney(neg.clientOffer)}/yıl</div>` +
      `<div class="neg-offer-compare">Orijinal: ${fmtMoney(neg.originalPrem)}/yıl</div>` +
      `<div class="neg-round">Tur ${neg.round}/${neg.maxRounds}</div>`;

    // Hide counter input from previous round
    document.getElementById('neg-counter-input').style.display = 'none';

    // Show/hide counter button based on rounds remaining
    const counterBtn = document.getElementById('neg-counter');
    counterBtn.style.display = neg.round < neg.maxRounds ? 'block' : 'none';
  }

  resolveNegotiation(action) {
    const cl = this.state.clients.find(c => c.id === this.state.selectedClientId);
    if (!cl || !cl.negotiation) return;

    const neg = cl.negotiation;

    if (action === 'accept') {
      // Accept client's counter-offer
      cl.premiumTiers.negotiated = neg.clientOffer;
      cl.selectedPremium = 'negotiated';
      cl.satisfaction += 10; // Happy about the deal

      this.ui.addLog('🤝', `${cl.companyName} ile ${fmtMoney(neg.clientOffer)}/yıl'a anlaşıldı (%${neg.discount} indirim)`, 'ev-good');
      this.ui.toast(`Müzakere başarılı!`, 'green', '🤝');
      this.sound.play('accept');

      this.finalizeNegotiation(cl);

    } else if (action === 'counter') {
      // Show counter-offer slider
      const counterInput = document.getElementById('neg-counter-input');
      counterInput.style.display = 'block';
      this.sound.play('click');

      const slider = document.getElementById('neg-slider');
      const lowBound = neg.clientOffer;
      const highBound = neg.originalPrem;

      slider.min = lowBound;
      slider.max = highBound;
      slider.value = Math.round((lowBound + highBound) / 2);

      document.getElementById('neg-range-low').textContent = fmtMoney(lowBound);
      document.getElementById('neg-range-high').textContent = fmtMoney(highBound);
      document.getElementById('neg-player-offer').textContent = fmtMoney(slider.value);

      // Hide the 3 action buttons
      document.querySelector('.neg-buttons').style.display = 'none';

    } else if (action === 'reject') {
      // Walk away
      this.finalizeRejection(cl);
    }
  }

  submitCounterOffer() {
    const cl = this.state.clients.find(c => c.id === this.state.selectedClientId);
    if (!cl || !cl.negotiation) return;

    const neg = cl.negotiation;
    const playerOffer = parseInt(document.getElementById('neg-slider').value);

    // Calculate acceptance probability: closer to client's offer = higher chance
    const range = neg.originalPrem - neg.clientOffer;
    const playerDiscount = neg.originalPrem - playerOffer;
    const generosity = range > 0 ? playerDiscount / range : 0; // 0 = original price, 1 = client's price
    const acceptChance = 0.2 + (generosity * 0.7); // 20% at original price, 90% at client's price

    if (Math.random() < acceptChance) {
      // Client accepts player's counter-offer
      cl.premiumTiers.negotiated = playerOffer;
      cl.selectedPremium = 'negotiated';
      cl.satisfaction += 3; // Mild satisfaction — compromise

      const finalDiscount = Math.round((1 - playerOffer / neg.originalPrem) * 100);
      this.ui.addLog('🤝', `${cl.companyName} karşı teklifinizi KABUL ETTİ! Prim: ${fmtMoney(playerOffer)}/yıl (%${finalDiscount} indirim)`, 'ev-good');
      this.ui.toast(`Teklif kabul edildi!`, 'green', '🤝');
      this.sound.play('accept');

      this.finalizeNegotiation(cl);
    } else {
      // Client rejects — can they make a final offer?
      neg.round++;
      if (neg.round <= neg.maxRounds) {
        // Client adjusts their offer slightly up (meeting in the middle)
        const midpoint = Math.round((playerOffer + neg.clientOffer) / 2);
        neg.clientOffer = midpoint;
        neg.discount = Math.round((1 - midpoint / neg.originalPrem) * 100);

        this.sound.play('reject');

        this.story.playSequence([
          { name: cl.companyName, portrait: 'assets/system.png', text: `Hmm, o kadar veremeyiz ama ortasında buluşalım: ${fmtMoney(midpoint)}/yıl. Son teklifimiz bu.` }
        ]);
        this.story.onClose = () => {
          this.story.onClose = null;
          document.querySelector('.neg-buttons').style.display = 'flex';
          document.getElementById('neg-counter-input').style.display = 'none';
          this.showNegotiationPanel(cl);
        };
      } else {
        // Final rejection — client walks away
        this.sound.play('reject');
        this.story.playSequence([
          { name: cl.companyName, portrait: 'assets/system.png', text: 'Anlaşamadık. Başka bir sigorta şirketiyle çalışacağız. Hoşça kalın.' }
        ]);
        this.story.onClose = () => {
          this.story.onClose = null;
          this.finalizeRejection(cl);
        };
      }
    }
  }

  finalizeNegotiation(cl) {
    // Process recommendations as normal
    cl.selectedRecs.forEach(recId => {
      const rec = RECOMMENDATIONS.find(r => r.id === recId);
      if (!rec) return;
      if (Math.random() < rec.chance) {
        cl.acceptedRecs.push(recId);
        cl.risk = clamp(cl.risk - rec.reduction, 5, 95);
        cl.satisfaction += 5;
        this.ui.addLog(rec.icon, `${cl.companyName} "${rec.name}" KABUL ETTİ. Risk: -${rec.reduction}`, 'ev-good');
      } else {
        cl.rejectedRecs.push(recId);
        cl.satisfaction -= 10;
        this.ui.addLog('❌', `${cl.companyName} "${rec.name}" REDDETTİ.`, 'ev-fire');
      }
    });

    cl.status = 'insured';
    this.state.portfolio.push(cl);
    this.state.pendingClients = this.state.pendingClients.filter(c => c.id !== cl.id);

    const prem = cl.premiumTiers[cl.selectedPremium];
    this.ui.addLog('✅', `${cl.companyName} sigortalandı. Prim: ${fmtMoney(prem)}/yıl`, 'ev-good');
    this.sound.play('accept');

    // Clean up UI
    document.getElementById('negotiation-panel').style.display = 'none';
    this.state.selectedClientId = null;
    this.ui.renderDecisionPanel(null);
    this.ui.updateAll();
    this.checkAllAchievements();
    if (window.innerWidth <= 768) this.switchMobileTab('clients');
  }

  finalizeRejection(cl) {
    cl.status = 'rejected';
    this.state.pendingClients = this.state.pendingClients.filter(c => c.id !== cl.id);
    this.ui.addLog('🏃', `${cl.companyName} ile anlaşılamadı, müşteri gitti.`, 'ev-fire');
    this.ui.toast(`Müzakere başarısız!`, 'red', '🏃');
    this.sound.play('reject');

    // Clean up UI
    document.getElementById('negotiation-panel').style.display = 'none';
    this.state.selectedClientId = null;
    this.ui.renderDecisionPanel(null);
    this.ui.updateAll();
    if (window.innerWidth <= 768) this.switchMobileTab('clients');
  }

  rejectClient() {
    const cl = this.state.clients.find(c => c.id === this.state.selectedClientId);
    if (!cl || cl.status !== 'pending') return;
    cl.status = 'rejected';
    this.state.pendingClients = this.state.pendingClients.filter(c => c.id !== cl.id);
    this.ui.addLog('❌', `${cl.companyName} reddedildi.`, '');
    this.ui.toast(`Başvuru reddedildi.`, 'red', '❌');
    this.sound.play('reject');
    this.state.selectedClientId = null;
    this.ui.renderDecisionPanel(null);
    this.ui.updateAll();
    // Auto-switch back to clients on mobile
    if (window.innerWidth <= 768) this.switchMobileTab('clients');
  }

  buyReinsurance() {
    if (this.state.hasReinsurance || this.state.cash < 25000) return;
    this.state.cash -= 25000;
    this.state.hasReinsurance = true;
    this.state.reinsuranceCap = 100000;
    this.ui.addLog('🛡️', 'Reasürans satın alındı! Max hasar: $100K', 'ev-good');
    this.ui.toast('Reasürans aktif!', 'green', '🛡️');
    this.sound.play('money');
    this.ui.updateAll();
    this.checkAchievement('reinsurance');
    // Re-render decision panel to remove button
    const cl = this.state.clients.find(c => c.id === this.state.selectedClientId);
    if (cl) this.ui.renderDecisionPanel(cl);
  }

  buyUpgrade(id) {
    const upg = UPGRADES.find(u => u.id === id);
    if (!upg || this.state.upgrades.includes(id) || this.state.cash < upg.cost) return;

    this.state.cash -= upg.cost;
    this.state.upgrades.push(id);
    this.ui.addLog(upg.icon, `YATIRIM: ${upg.name} satın alındı!`, 'ev-good');
    this.ui.toast(`${upg.name} aktif!`, 'green', upg.icon);
    this.sound.play('money');
    this.ui.updateAll();
  }

  advanceMonth() {
    if (this.state.isGameOver) return;
    if (this.story.isActive) return; // Prevent advancing while story is playing

    // Bankruptcy & One-Time Credit Check
    if (this.state.cash < 0) {
      this.sound.play('warning');
      VFX.shake('severe');
      if (!this.flags.usedCredit) {
        this.flags.usedCredit = true;
        this.state.cash += 150000;
        this.ui.updateAll();
        this.story.playSequence([
          { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Kasada paramız kalmadı! Şirketi kurtarmak için bankadan acil durum kredisi çektim. 150,000$ nakit girişi sağlandı fakat bu son şansımız.' },
          { name: 'Sistem', portrait: 'assets/system.png', text: 'ACİL KREDİ ONAYLANDI: +$150,000. Bir daha eksi bakiyeye düşerseniz şirket iflas edecektir.' }
        ]);
        return; // Pause advancement until they finish the dialog
      } else {
        // Second time bankrupt -> Game Over
        this.story.playSequence([
          { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Yine eksiye düştük... Artık bankalar da bize kredi vermiyor. Her şey bitti, iflas ettik.' }
        ]);
        this.story.onClose = () => {
          this.story.onClose = null;
          this.endGame();
        };
        return;
      }
    }

    if (this.state.month >= TOTAL_MONTHS) { this.endGame(); return; }

    this.state.fireMultiplier = 1.0; // Reset multipliers
    let storyQueue = [];

    // Midpoint Story Check
    if (this.state.month === 12 && !this.flags.seenMidpoint) {
      this.flags.seenMidpoint = true;
      storyQueue.push(...[
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: `İlk yılımızı tamamladık! Kasada ${fmtMoneyS(this.state.cash)} var. Portföyümüz büyüyor, fena gitmiyoruz.` },
        { name: 'Kerem (Güven Sigorta)', portrait: 'assets/kerem.png', text: 'Hala batmadınız mı? Şansınız yaver gidiyor olmalı. Ama asıl zorluk 2. yılda başlıyor.' }
      ]);
    }

    // Dynamic Random Events (25% chance per month starting month 2)
    if (this.state.month > 1 && this.state.month !== 12 && Math.random() < 0.25) {
      const ev = pick(DYNAMIC_EVENTS);
      const dialogs = ev.execute(this.state);
      if (dialogs) storyQueue.push(...dialogs);
    }

    if (storyQueue.length > 0) {
      this.story.playSequence(storyQueue);
      this.story.onClose = () => {
        this.story.onClose = null;
        this.runMonthSimulation();
      };
      return;
    }

    this.runMonthSimulation();
  }

  runMonthSimulation() {
    this.sound.play('quarter'); // Re-using quarter sound for month advance
    // Auto-close pending
    this.state.pendingClients.forEach(c => { c.status = 'rejected'; this.ui.addLog('⏩', `${c.companyName} — süre doldu.`, ''); });
    this.state.pendingClients = [];

    // Policy renewals (every 12 months = yearly)
    if (this.state.month > 0 && this.state.month % 12 === 0) {
      this.state.portfolio.forEach(cl => {
        if (cl.satisfaction >= 50 && Math.random() < (cl.satisfaction / 100)) {
          cl.renewCount++;
          cl.satisfaction += 3;
          this.ui.addLog('🔄', `${cl.companyName} poliçesini YENİLEDİ!`, 'ev-good');
        }
      });
    }

    // Monthly premium collection (Dividing the tier by 12)
    let mPrem = 0;
    this.state.portfolio.forEach(cl => { mPrem += Math.round(cl.premiumTiers[cl.selectedPremium] / 12); });
    this.state.totalPremium += mPrem;
    this.state.ytdPremium += mPrem;
    this.state.cash += mPrem;
    this.state.cash += this.state.monthlyIncome; // operational income
    if (mPrem > 0) {
      this.ui.addLog('💰', `Aylık Prim: +${fmtMoney(mPrem)}`, 'ev-money');
      VFX.floatText(fmtMoney(mPrem), 'topbar-cash', true);
      this.sound.play('cash_up');
    }

    // Agent commission deduction
    this.collectAgentCommissions(mPrem);

    // Agent phase: bring clients, events, loyalty
    this.processAgentPhase();

    // Update BGM tempo based on cash
    this.sound.updateBgm(this.state.cash);

    // Reset fires log if starting a new quarter section
    if ((this.state.month - 1) % 3 === 0) {
      this.state.monthFires = [];
    }

    // Fire check
    this.state.pendingFireEvents = [];
    this.state.portfolio.forEach(cl => {
      if (cl.status !== 'insured') return;
      let prob;
      // Rebalanced monthly probabilities (Option A):
      // Risk 20 (Good) => ~0.3% per month (3.6% per year)
      // Risk 50 (Med) => ~1.2% per month (13.5% / year)
      // Risk 80 (Bad) => ~3.5% per month (35% / year)
      if (cl.risk >= 70) prob = 0.025 + ((cl.risk - 70) / 500);
      else if (cl.risk >= 40) prob = 0.008 + ((cl.risk - 40) / 2500);
      else prob = 0.001 + (cl.risk / 10000);

      prob *= this.state.fireMultiplier;
      if (Math.random() < prob) {
        const dmgPct = 0.2 + Math.random() * 0.6;
        let damage = Math.round(cl.value * dmgPct);
        let claim = Math.round(damage * 0.90);
        if (this.state.hasReinsurance && claim > this.state.reinsuranceCap) {
          claim = this.state.reinsuranceCap;
          this.ui.addLog('🛡️', `Reasürans devrede! Hasar ${fmtMoney(claim)} ile sınırlandı.`, 'ev-good');
        }
        cl.hasFired = true;
        cl.fireDamage += claim;
        cl.satisfaction -= 15;
        this.state.totalClaims += claim;
        this.state.ytdClaims += claim;
        this.state.totalFires++;
        this.state.cash -= claim;

        VFX.floatText(fmtMoney(claim), 'topbar-cash', false);
        VFX.shake('normal');

        this.state.monthFires.push({ client: cl, damage, claim });
        this.state.pendingFireEvents.push({ client: cl, damage, claim });
        this.ui.addLog('🔥', `${cl.companyName} yanıyor! Tazminat: ${fmtMoney(claim)}`, 'ev-fire');
      }
    });

    // First Fire Story Injection
    if (this.state.monthFires.length > 0 && !this.flags.seenFirstFire) {
      this.flags.seenFirstFire = true;
      // Tell processNextFire to play story first
      this.pendingFirstFireStory = true;
    }

    // Reset YTD at year end
    if (this.state.month > 0 && this.state.month % 12 === 0) {
      this.state.prevYearLossRatio = this.state.ytdPremium > 0 ? Math.round((this.state.ytdClaims / this.state.ytdPremium) * 100) : this.state.prevYearLossRatio;
      this.state.ytdPremium = 0;
      this.state.ytdClaims = 0;
    }

    this.state.month++;

    // Only update chart every 3 months (quarterly) or at end
    if (this.state.month % 3 === 0) {
      this.state.chartData.push({ q: this.state.month / 3, premium: mPrem * 3, claims: this.state.monthFires.reduce((s, f) => s + f.claim, 0) });
    }

    // Simulate competitors
    simulateCompetitors(this.state);

    // Dynamic ticker
    document.getElementById('ticker-text').textContent = pick(TICKER_MSGS);

    // Generate new clients
    this.generateNewClients();
    this.state.selectedClientId = null;
    this.ui.renderDecisionPanel(null);
    this.ui.updateAll();

    // Check achievements
    if (this.state.monthFires.length === 0 && this.state.portfolio.length > 0) this.checkAchievement('no_fire_quarter', 'nofire');
    const lb = getLeaderboard(this.state);
    if (lb[0]?.isPlayer) this.checkAchievement('top_rank', 'rank1');
    this.checkAllAchievements();

    // Show fires then report
    this.processNextFire();
  }

  processNextFire() {
    if (this.pendingFirstFireStory) {
      this.pendingFirstFireStory = false;
      this.story.playSequence([
        { name: 'Sistem', portrait: 'assets/system.png', text: 'ACİL DURUM ALERT: SİGORTALI TESİS YANIYOR!' },
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Hayır olamaz! İlk yangınımız... Hemen hasar dosyasını açıp müşteriye ödeme yapmalıyız. Umarım kasada yeterli para vardır.' }
      ]);
      this.story.onClose = () => {
        this.story.onClose = null;
        this.processNextFire();
      };
      return;
    }

    if (this.state.pendingFireEvents.length > 0) {
      const f = this.state.pendingFireEvents.shift();
      spawnFireParticles();
      this.sound.play('fire');

      // Hook in the Mini-Game before finalizing damage
      this.minigame.start(f, (result) => {
        // Result contains multiplier, msg, rank, finalClaim

        // Adjust client stats and company cash based on the retroactive multiplier
        const difference = f.claim - result.finalClaim;
        this.state.cash += difference; // Refund the difference (you already deducted 100% in simulation loop)
        this.state.totalClaims -= difference;
        this.state.ytdClaims -= difference;
        f.client.fireDamage -= difference;

        f.claim = result.finalClaim; // Update the event record

        // Add retroactive logs
        this.ui.addLog('🚒', `Yangın Müdahalesi: ${result.msg} (Tazminat: ${fmtMoney(result.finalClaim)})`, `mg-score-${result.rank}`);

        // Show the summary modal as normal
        this.ui.showFireModal(f.client, result.finalDamage, f.claim);
      });

    } else {
      // month was already incremented in runMonthSimulation. 
      // If we finished month 3, state.month is now 4. So checking if (month - 1) % 3 === 0
      if ((this.state.month - 1) % 3 === 0 && this.state.month > 1) {
        this.ui.showQuarterReport();
      } else if (this.state.month > TOTAL_MONTHS) {
        this.endGame();
      }
    }
  }

  checkAchievement(id, ctx) {
    if (this.state.achievements[id]) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    if (ach.check(this.state, ctx)) {
      this.state.achievements[id] = true;
      this.ui.toast(`🏆 ${ach.name}!`, 'amber', ach.icon);
      this.sound.play('badge');
      this.ui.renderAchievements();
    }
  }

  checkAllAchievements() {
    ACHIEVEMENTS.forEach(a => { if (!this.state.achievements[a.id] && a.check(this.state, null)) { this.state.achievements[a.id] = true; this.ui.toast(`🏆 ${a.name}!`, 'amber', a.icon); this.sound.play('badge'); } });
    this.ui.renderAchievements();
  }

  endGame() {
    if (this.state.isGameOver) return; // Prevent double firing
    this.state.isGameOver = true;
    this.ui.renderGameOver();
    this.sound.play('quarter');

    // Special story dialog on finish based on rank
    const lb = getLeaderboard(this.state);
    const rank = lb.findIndex(l => l.isPlayer) + 1;
    let endSeq = [];
    if (rank === 1) {
      endSeq = [
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Bunu başardık! Sektörün bir numarasıyız! Dipten gelip herkesi geçtik!' },
        { name: 'Kerem (Güven Sigorta)', portrait: 'assets/kerem.png', text: 'İnanılmaz... Sizi çok hafife almışım. Tebrikler, piyasa artık sizin.' }
      ];
    } else if (rank <= 3) {
      endSeq = [
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'İlk üçe girdik! Harika bir iş çıkardın. Yakında 1 numara olabiliriz.' }
      ];
    } else {
      endSeq = [
        { name: 'Aylin (CEO)', portrait: 'assets/ceo_aylin.png', text: 'Piyasa sandığımızdan zorluymuş. Daha çok fırın ekmek yememiz lazım...' },
        { name: 'Kerem (Güven Sigorta)', portrait: 'assets/kerem.png', text: 'Size söylemiştim. Büyükler ligine girmek kolay değildir.' }
      ];
    }

    this.story.onClose = () => {
      this.story.onClose = null;
      this.ui.showScreen('gameover-screen');
    };

    this.ui.updateAll();
    // Start sequence, which will then show gameover screen on close
    this.story.playSequence(endSeq);
  }
}

// ════════════════════════════ FIRE MINI-GAME (WATER PRESSURE) ════════════════════════════

class MiniGame {
  constructor(game) {
    this.game = game;
    this.isActive = false;
    this.pressure = 0; // 0 to 100
    this.targetStart = 30;
    this.targetEnd = 65;
    this.dropRate = 0.8; // Amount to drop per tick (gentler)
    this.pumpPower = 12; // Amount to increase per tap (stronger)
    this.timeLeft = 5000; // 5 seconds
    this.lastTime = 0;
    this.greenTime = 0; // ms spent in green zone
    this.loopId = null;
    this.countdownActive = false;

    this.overlay = document.getElementById('mg-overlay');
    this.indicator = document.getElementById('mg-indicator');
    this.targetZone = document.getElementById('mg-target-zone');
    this.timeEl = document.getElementById('mg-time-left');
    this.btn = document.getElementById('mg-pump-btn');
    this.descEl = document.getElementById('mg-desc');
    this.titleEl = document.getElementById('mg-title');

    if (this.btn) this.btn.addEventListener('click', () => this.pump());

    // Keyboard support for pumping
    document.addEventListener('keydown', (e) => {
      if (this.isActive && (e.code === 'Space' || e.code === 'Enter')) {
        this.pump();
      }
    });

    if (this.targetZone) {
      this.targetZone.style.left = this.targetStart + '%';
      this.targetZone.style.width = (this.targetEnd - this.targetStart) + '%';
    }
  }

  start(fireEventData, onComplete) {
    this.fireData = fireEventData;
    this.onComplete = onComplete;
    this.pressure = 0;
    this.timeLeft = 5000; // 5 seconds total
    this.greenTime = 0;
    this.countdownActive = true;
    this.isActive = false; // Not active until countdown ends

    if (this.overlay) this.overlay.style.display = 'flex';
    if (this.btn) this.btn.style.display = 'none'; // Hide button during countdown
    this.updateUI();

    this.game.sound.play('warning');

    // 3-2-1 Countdown before game starts
    let count = 3;
    if (this.titleEl) this.titleEl.textContent = '🔥 YANGIN ALARMI! 🔥';
    if (this.descEl) this.descEl.innerHTML = `Hazır ol! Basıncı <span style="color:#0f0;font-weight:bold">YEŞİL ALANA</span> getir!<br>Tıkla veya BOŞLUK tuşuna bas!<br><br><span style="font-size:2em;color:#ff0">🚨 ${count} 🚨</span>`;

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        if (this.descEl) this.descEl.innerHTML = `Hazır ol! Basıncı <span style="color:#0f0;font-weight:bold">YEŞİL ALANA</span> getir!<br>Tıkla veya BOŞLUK tuşuna bas!<br><br><span style="font-size:2em;color:#ff0">🚨 ${count} 🚨</span>`;
        this.game.sound.play('click');
      } else {
        clearInterval(countdownInterval);
        this.countdownActive = false;
        this.isActive = true;
        this.pressure = 30; // Start near the target zone
        this.lastTime = performance.now();
        if (this.titleEl) this.titleEl.textContent = '🔥 YANGIN MÜDAHALESİ 🔥';
        if (this.descEl) this.descEl.innerHTML = `Basıncı <span style="color:#0f0;font-weight:bold">YEŞİL ALANDA</span> tut! Sürekli bas!`;
        if (this.btn) this.btn.style.display = 'block';
        this.game.sound.play('fire');
        this.loopId = requestAnimationFrame((t) => this.loop(t));
      }
    }, 1000);
  }

  pump() {
    if (!this.isActive) return;
    this.pressure = Math.min(100, this.pressure + this.pumpPower);
    this.game.sound.play('click'); // Tap sound
    this.updateUI();
  }

  loop(timestamp) {
    if (!this.isActive) return;

    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.timeLeft -= dt;

    // Drop pressure
    this.pressure = Math.max(0, this.pressure - this.dropRate * (dt / 16.6)); // Normalized to 60fps

    // Check if in sweet spot
    const inZone = this.pressure >= this.targetStart && this.pressure <= this.targetEnd;
    if (inZone) {
      this.greenTime += dt;
      if (this.indicator) this.indicator.classList.remove('danger');
    } else {
      if (this.indicator) this.indicator.classList.add('danger');
    }

    this.updateUI();

    if (this.timeLeft <= 0) {
      this.endGame();
    } else {
      this.loopId = requestAnimationFrame((t) => this.loop(t));
    }
  }

  updateUI() {
    if (this.indicator) this.indicator.style.left = this.pressure + '%';
    if (this.timeEl) this.timeEl.textContent = 'Kalan: ' + (Math.max(0, this.timeLeft) / 1000).toFixed(1) + 's';
  }

  endGame() {
    this.isActive = false;
    cancelAnimationFrame(this.loopId);
    if (this.overlay) this.overlay.style.display = 'none';

    // Calculate score based on green time vs total time
    // Maximum possible green time is slightly less than total time because you start outside it
    const maxPossible = 4500;
    const ratio = this.greenTime / maxPossible;

    let multiplier = 1.0;
    let rank = 'bad';
    let msg = 'Başarısız müdahale! Yangın büyüdü.';

    if (ratio > 0.75) {
      multiplier = 0.5; // 50% reduction
      rank = 'perfect';
      msg = 'Mükemmel tazyik! Hasar %50 azaltıldı.';
      this.game.sound.play('accept');
    } else if (ratio > 0.40) {
      multiplier = 0.8; // 20% reduction
      rank = 'good';
      msg = 'Fena değil. Hasar %20 azaltıldı.';
      this.game.sound.play('money');
    } else {
      multiplier = 1.2; // 20% penalty
      this.game.sound.play('reject');
    }

    const finalDamage = Math.round(this.fireData.damage * multiplier);
    const finalClaim = Math.round(this.fireData.claim * multiplier);

    // Provide the results back to the game
    this.onComplete({
      rank,
      msg,
      multiplier,
      finalDamage,
      finalClaim
    });
  }
}

// ── Init ──
const game = new Game();

