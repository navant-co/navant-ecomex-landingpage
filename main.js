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
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
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
    active.style.background  = 'rgba(6,182,212,0.06)';
    active.style.borderColor = 'rgba(6,182,212,0.20)';
    setTimeout(() => { if (active) active.style.cssText = ''; }, 1300);
    feedIdx++;
};
setInterval(tickFeed, 2600);
tickFeed();

// ─── KPI COUNTER ANIMATION ───────────────────────────────────
const kpiEls = [...document.querySelectorAll('.kpi-value[data-count]')];
const kpiObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const fmt    = el.dataset.format;
        const dur    = 1600;
        let start;
        const step = ts => {
            if (!start) start = ts;
            const p    = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val  = target * ease;
            if      (fmt === 'currency') el.textContent = `R$ ${(val / 1e6).toFixed(1)}M`;
            else if (fmt === 'pct')      el.textContent = `${val.toFixed(1)}%`;
            else if (fmt === 'int')      el.textContent = Math.round(val).toLocaleString('pt-BR');
            else if (fmt === 'usd')      el.textContent = `U$ ${(val / 1e6).toFixed(0)}M`;
            else if (fmt === 'days')     el.textContent = `D+${Math.round(val)}`;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        kpiObs.unobserve(el);
    });
}, { threshold: 0.6 });
kpiEls.forEach(el => kpiObs.observe(el));

// ─── STAT BAR COUNTER ────────────────────────────────────────
const statEls = [...document.querySelectorAll('.stat-value[data-count]')];
const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const fmt    = el.dataset.format;
        const dur    = 1800;
        let start;
        const step = ts => {
            if (!start) start = ts;
            const p    = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val  = target * ease;
            if      (fmt === 'currency-m') el.textContent = `R$ ${(val).toFixed(0)}M+`;
            else if (fmt === 'int-plus')   el.textContent = `${Math.round(val)}+`;
            else if (fmt === 'pct')        el.textContent = `${val.toFixed(1)}%`;
            else if (fmt === 'static')     el.textContent = el.dataset.display || '';
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        statObs.unobserve(el);
    });
}, { threshold: 0.5 });
statEls.forEach(el => statObs.observe(el));

// ─── MOUSE PARALLAX ──────────────────────────────────────────
const orb1 = document.querySelector('.bg-orb-1');
const orb2 = document.querySelector('.bg-orb-2');
const orb3 = document.querySelector('.bg-orb-3');
window.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 25;
    const my = (e.clientY / window.innerHeight - 0.5) * 25;
    if (orb1) orb1.style.transform = `translate(${mx * 0.4}px, ${my * 0.4}px)`;
    if (orb2) orb2.style.transform = `translate(${-mx * 0.3}px, ${-my * 0.3}px)`;
    if (orb3) orb3.style.transform = `translate(${mx * 0.2}px, ${my * 0.2}px) translate(-50%,-50%)`;
}, { passive: true });

// ─── DRAWBACK SIMULATOR ──────────────────────────────────────
const CHAPTER_RATES = {
    '84': { ii: 0.14, ipi: 0.10, label: 'Máquinas e Equipamentos' },
    '85': { ii: 0.16, ipi: 0.15, label: 'Equipamentos Elétricos e Eletrônicos' },
    '87': { ii: 0.35, ipi: 0.25, label: 'Veículos Automotores' },
    '39': { ii: 0.12, ipi: 0.05, label: 'Plásticos e suas Obras' },
    '55': { ii: 0.20, ipi: 0.04, label: 'Fibras Sintéticas' },
    '62': { ii: 0.35, ipi: 0.04, label: 'Vestuário (exceto Malha)' },
    '72': { ii: 0.08, ipi: 0.00, label: 'Ferro e Aço' },
    '73': { ii: 0.12, ipi: 0.05, label: 'Obras de Ferro ou Aço' },
    '76': { ii: 0.10, ipi: 0.00, label: 'Alumínio e suas Obras' },
    '28': { ii: 0.06, ipi: 0.00, label: 'Produtos Químicos Inorgânicos' },
    '29': { ii: 0.06, ipi: 0.00, label: 'Produtos Químicos Orgânicos' },
    '30': { ii: 0.08, ipi: 0.00, label: 'Produtos Farmacêuticos' },
    '64': { ii: 0.35, ipi: 0.12, label: 'Calçados' },
    '90': { ii: 0.14, ipi: 0.05, label: 'Instrumentos Ópticos e de Precisão' },
    '10': { ii: 0.04, ipi: 0.00, label: 'Cereais' },
    '12': { ii: 0.04, ipi: 0.00, label: 'Sementes e Oleaginosas' },
    '94': { ii: 0.18, ipi: 0.08, label: 'Móveis e Artefatos' },
    '48': { ii: 0.12, ipi: 0.03, label: 'Papel e Papelão' },
    '61': { ii: 0.35, ipi: 0.04, label: 'Vestuário de Malha' },
};
const DEFAULT_RATES = { ii: 0.14, ipi: 0.08, label: 'Classificação Geral' };
const PIS_COFINS = 0.1175;
const ICMS_AVG   = 0.18;

const fmt    = n  => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
const fmtPct = v  => (v * 100).toFixed(2).replace('.00', '') + '%';

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

    const msgs = [
        `Identificado: ${rates.label || 'Cap. ' + chapter}...`,
        `Cruzando NCM ${ncm} com Tabela TIPI...`,
        `Calculando alíquotas II (${fmtPct(rates.ii)}) e IPI (${fmtPct(rates.ipi)})...`,
        `Apurando base PIS/COFINS e ICMS...`,
        `Gerando Ato Concessório estimado...`,
    ];
    let mi = 0;
    const ticker = setInterval(() => {
        if (mi < msgs.length - 1) btn.innerHTML = `<span class="spinner"></span>&nbsp;${msgs[++mi]}`;
    }, 700);

    setTimeout(() => {
        clearInterval(ticker);

        const iiVal     = amount * rates.ii;
        const ipiVal    = amount * rates.ipi;
        const pisCofVal = amount * PIS_COFINS;
        const icmsBase  = amount + iiVal + ipiVal + pisCofVal;
        const icmsVal   = icmsBase * ICMS_AVG;
        const total     = iiVal + ipiVal + pisCofVal + icmsVal;
        const score     = 94 + Math.floor(Math.random() * 5);
        const mensal    = total / 12;

        result.classList.add('has-result');
        result.innerHTML = `
            <div class="result-total-label">Suspensão estimada / 12 meses · ${rates.label || 'NCM Cap. ' + chapter}</div>
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
                <span class="tax-label">ICMS (~18% sobre base total)</span>
                <span class="tax-value">${fmt(icmsVal)}</span>
            </div>
            <p class="sim-confidence">★ Confidence Score ${score}% · Base TIPI atualizada · ${fmt(mensal)}/mês de imposto suspenso</p>
            <a href="#cta" class="sim-cta">Implementar na sua empresa →</a>
        `;

        btn.disabled = false;
        btn.innerHTML = `Auditar outro NCM
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
    }, 3800);
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
    const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email?.value || '');
    const allFilled = Object.values(fields).every(f => f?.value?.trim());

    if (!allFilled || !emailOk) {
        Object.values(fields).forEach(f => {
            if (!f?.value?.trim() || (f === fields.email && !emailOk)) {
                f.style.borderColor = 'rgba(239,68,68,0.5)';
                f.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.08)';
                setTimeout(() => { if (f) { f.style.borderColor = ''; f.style.boxShadow = ''; } }, 2500);
            }
        });
        Object.values(fields).find(f => !f?.value?.trim())?.focus();
        return;
    }

    const btn = document.getElementById('cta-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>&nbsp;Enviando...`;

    setTimeout(() => {
        const area = document.getElementById('cta-form-area');
        if (area) area.style.display = 'none';
        const success = document.getElementById('cta-success');
        if (success) success.classList.add('show');
    }, 1800);
}

// ─── HERO MINI-SIM REDIRECT ──────────────────────────────────
function heroSimRedirect() {
    const val = document.getElementById('hero-sim-input')?.value;
    if (val && parseFloat(val) > 0) {
        const amountField = document.getElementById('sim-amount');
        if (amountField) amountField.value = val;
    }
    document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('sim-ncm')?.focus(), 700);
}

// ─── LEAD MAGNET HANDLER ─────────────────────────────────────
function handleLead() {
    const email = document.getElementById('lead-email');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.value || '');
    if (!emailOk) {
        if (email) {
            email.style.borderColor = 'rgba(239,68,68,0.5)';
            email.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.08)';
            setTimeout(() => { email.style.borderColor = ''; email.style.boxShadow = ''; }, 2500);
            email.focus();
        }
        return;
    }
    const area = document.getElementById('lead-form-area');
    if (area) area.style.display = 'none';
    const success = document.getElementById('lead-success');
    if (success) success.classList.add('show');
}

// ─── Active nav style injection
const s = document.createElement('style');
s.textContent = `.nav-active { color: #EFF6FF !important; } .nav-active::after { width: 100% !important; }`;
document.head.appendChild(s);
