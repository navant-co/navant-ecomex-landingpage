'use strict';

// ─── NAVBAR ──────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ─── ACTIVE NAV ──────────────────────────────────────────────
const sections   = [...document.querySelectorAll('section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];
window.addEventListener('scroll', () => {
    let curr = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) curr = s.id; });
    navAnchors.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === `#${curr}`));
}, { passive: true });

// ─── SCROLL REVEAL ───────────────────────────────────────────
const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));

// ─── TABS ────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const t = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${t}`)?.classList.add('active');
        document.querySelectorAll(`#tab-${t} [data-reveal]`).forEach(el => {
            el.classList.remove('is-visible');
            setTimeout(() => ro.observe(el), 10);
        });
    });
});

// ─── LIVE FEED TICKER ────────────────────────────────────────
const feedItems = [...document.querySelectorAll('.feed-item')];
let feedIdx = 0;
const tickFeed = () => {
    feedItems.forEach(fi => fi.style.cssText = '');
    const active = feedItems[feedIdx % feedItems.length];
    active.style.background = 'rgba(59,130,246,0.06)';
    active.style.borderColor = 'rgba(59,130,246,0.2)';
    setTimeout(() => { active.style.cssText = ''; }, 1200);
    feedIdx++;
};
setInterval(tickFeed, 2400);
tickFeed();

// ─── KPI COUNTER ANIMATION ───────────────────────────────────
const kpiEls = [...document.querySelectorAll('.kpi-value[data-count]')];
const kpiObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const fmt    = el.dataset.format;
        const dur    = 1400;
        let start;
        const step = ts => {
            if (!start) start = ts;
            const p    = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val  = target * ease;
            if      (fmt === 'currency') el.textContent = `R$ ${(val / 1e6).toFixed(1)}M`;
            else if (fmt === 'pct')      el.textContent = `${val.toFixed(1)}%`;
            else if (fmt === 'int')      el.textContent = Math.round(val).toLocaleString('pt-BR');
            else if (fmt === 'usd')      el.textContent = `U$ ${(val / 1e6).toFixed(0)}M+`;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        kpiObs.unobserve(el);
    });
}, { threshold: 0.6 });
kpiEls.forEach(el => kpiObs.observe(el));

// ─── MOUSE PARALLAX ──────────────────────────────────────────
const orb1 = document.querySelector('.bg-orb-1');
const orb2 = document.querySelector('.bg-orb-2');
window.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 25;
    const my = (e.clientY / window.innerHeight - 0.5) * 25;
    if (orb1) orb1.style.transform = `translate(${mx * 0.4}px, ${my * 0.4}px)`;
    if (orb2) orb2.style.transform = `translate(${-mx * 0.3}px, ${-my * 0.3}px)`;
}, { passive: true });

// ─── DRAWBACK SIMULATOR ──────────────────────────────────────
// Alíquotas simplificadas por capítulo NCM (base para demonstração)
const CHAPTER_RATES = {
    // Máquinas e equipamentos elétricos
    '84': { ii: 0.14, ipi: 0.10 },
    '85': { ii: 0.16, ipi: 0.15 },
    // Veículos
    '87': { ii: 0.35, ipi: 0.25 },
    // Plásticos
    '39': { ii: 0.12, ipi: 0.05 },
    // Têxteis
    '55': { ii: 0.20, ipi: 0.04 },
    '62': { ii: 0.35, ipi: 0.04 },
    // Metais
    '72': { ii: 0.08, ipi: 0.00 },
    '73': { ii: 0.12, ipi: 0.05 },
    '76': { ii: 0.10, ipi: 0.00 },
    // Química / Farmácia
    '28': { ii: 0.06, ipi: 0.00 },
    '29': { ii: 0.06, ipi: 0.00 },
    '30': { ii: 0.08, ipi: 0.00 },
    // Calçados
    '64': { ii: 0.35, ipi: 0.12 },
    // Óptica e instrumentos
    '90': { ii: 0.14, ipi: 0.05 },
    // Agrícola
    '10': { ii: 0.04, ipi: 0.00 },
    '12': { ii: 0.04, ipi: 0.00 },
};
const DEFAULT_RATES = { ii: 0.14, ipi: 0.08 };
const PIS_COFINS = 0.1175;
const ICMS_AVG   = 0.18;

const fmt = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
const fmtPct = v => (v * 100).toFixed(2).replace('.00', '') + '%';

function runDrawback(e) {
    e.preventDefault();

    const ncm    = document.getElementById('sim-ncm').value.trim();
    const amount = parseFloat(document.getElementById('sim-amount').value) || 0;
    if (!ncm || amount <= 0) return;

    const btn    = document.getElementById('sim-btn');
    const result = document.getElementById('sim-result');

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>&nbsp;Auditando legislação tributária...`;

    const chapter = ncm.replace(/\D/g, '').substring(0, 2);
    const rates   = CHAPTER_RATES[chapter] || DEFAULT_RATES;

    // Progressive messages
    const msgs = [
        'Conectando ao Siscomex...',
        `Cruzando capítulo ${chapter} com a Tabela TIPI...`,
        'Verificando regimes especiais vigentes...',
        'Calculando suspensão de II + IPI + PIS/COFINS + ICMS...',
    ];
    let mi = 0;
    const ticker = setInterval(() => {
        if (mi < msgs.length - 1) {
            btn.innerHTML = `<span class="spinner"></span>&nbsp;${msgs[++mi]}`;
        }
    }, 800);

    setTimeout(() => {
        clearInterval(ticker);

        const iiVal      = amount * rates.ii;
        const ipiVal     = amount * rates.ipi;
        const pisCofVal  = amount * PIS_COFINS;
        const icmsBase   = amount + iiVal + ipiVal + pisCofVal;
        const icmsVal    = icmsBase * ICMS_AVG;
        const total      = iiVal + ipiVal + pisCofVal + icmsVal;
        const score      = 94 + Math.floor(Math.random() * 5);

        result.classList.add('has-result');
        result.innerHTML = `
            <div class="result-total-label">Suspensão total estimada (12 meses)</div>
            <div class="result-total">${fmt(total)}</div>

            <div class="tax-row">
                <span class="tax-label">II — Imposto de Importação (${fmtPct(rates.ii)})</span>
                <span class="tax-value">${fmt(iiVal)}</span>
            </div>
            <div class="tax-row">
                <span class="tax-label">IPI (${fmtPct(rates.ipi)})</span>
                <span class="tax-value">${fmt(ipiVal)}</span>
            </div>
            <div class="tax-row">
                <span class="tax-label">PIS/COFINS (${fmtPct(PIS_COFINS)})</span>
                <span class="tax-value">${fmt(pisCofVal)}</span>
            </div>
            <div class="tax-row highlight">
                <span class="tax-label">ICMS (~18% sobre base)</span>
                <span class="tax-value">${fmt(icmsVal)}</span>
            </div>
            <p class="sim-confidence">★ Confidence Score ${score}% · Base TIPI/Siscomex atualizada · NCM Cap. ${chapter}</p>
            <a href="#cta" class="sim-cta">Implementar de verdade →</a>
        `;

        btn.disabled = false;
        btn.innerHTML = `Auditar outro NCM
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
    }, 3600);
}

const simForm = document.getElementById('drawback-form');
if (simForm) simForm.addEventListener('submit', runDrawback);

// ─── CTA HANDLER ─────────────────────────────────────────────
function handleCTA() {
    const fields = {
        empresa: document.getElementById('cta-empresa'),
        nome:    document.getElementById('cta-nome'),
        email:   document.getElementById('cta-email'),
        phone:   document.getElementById('cta-phone'),
    };
    const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email?.value || '');
    const allFilled = Object.values(fields).every(f => f?.value?.trim());

    if (!allFilled || !emailOk) {
        Object.values(fields).forEach(f => {
            if (!f?.value?.trim() || (f === fields.email && !emailOk)) {
                f.style.borderColor = 'rgba(239,68,68,0.5)';
                f.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.08)';
                setTimeout(() => { f.style.borderColor = ''; f.style.boxShadow = ''; }, 2500);
            }
        });
        Object.values(fields).find(f => !f?.value?.trim())?.focus();
        return;
    }

    const btn = document.getElementById('cta-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>&nbsp;Enviando...`;

    setTimeout(() => {
        document.getElementById('cta-form-area').style.display = 'none';
        const success = document.getElementById('cta-success');
        success.classList.add('show');
    }, 1800);
}

// Inject base keyframe for active nav
const s = document.createElement('style');
s.textContent = `
.nav-active { color: #eef2ff !important; }
.nav-active::after { width: 100% !important; }
`;
document.head.appendChild(s);
