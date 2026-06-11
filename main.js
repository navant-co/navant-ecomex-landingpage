'use strict';

// ─── NAVBAR ──────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ─── ACTIVE NAV ──────────────────────────────────────────────
const sections = [...document.querySelectorAll('section[id]')];
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
    if (active) {
        active.style.background = 'var(--primary-blue-l)';
        active.style.borderColor = 'var(--primary-blue-b)';
    }
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
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const fmt = el.dataset.format;
        const dur = 1600;
        let start;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val = target * ease;
            if (fmt === 'currency') el.textContent = `R$ ${(val / 1e6).toFixed(1)}M`;
            else if (fmt === 'pct') el.textContent = `${val.toFixed(1)}%`;
            else if (fmt === 'int') el.textContent = Math.round(val).toLocaleString('pt-BR');
            else if (fmt === 'usd') el.textContent = `U$ ${(val / 1e6).toFixed(0)}M`;
            else if (fmt === 'days') el.textContent = `D+${Math.round(val)}`;
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
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const fmt = el.dataset.format;
        const dur = 1800;
        let start;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val = target * ease;
            if (fmt === 'currency-m') el.textContent = `R$ ${(val).toFixed(0)}M+`;
            else if (fmt === 'int-plus') el.textContent = `${Math.round(val)}+`;
            else if (fmt === 'pct') el.textContent = `${val.toFixed(1)}%`;
            else if (fmt === 'static') el.textContent = el.dataset.display || '';
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
    const mx = (e.clientX / window.innerWidth - 0.5) * 25;
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
const ICMS_AVG = 0.18;

const fmt = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
const fmtPct = v => (v * 100).toFixed(2).replace('.00', '') + '%';

function runDrawback(e) {
    e.preventDefault();

    const amount = parseFloat(
        document.getElementById('sim-amount').value
    ) || 0;

    if (amount <= 0) return;

    const btn = document.getElementById('sim-btn');
    const result = document.getElementById('sim-result');

    btn.disabled = true;
    btn.innerHTML =
        `<span class="spinner"></span>&nbsp;Analisando operação de exportação...`;

    const msgs = [
        'Mapeando fluxo operacional...',
        'Analisando custos administrativos...',
        'Calculando eficiência documental...',
        'Estimando ganhos logísticos...',
        'Gerando diagnóstico operacional...'
    ];

    let mi = 0;

    const ticker = setInterval(() => {
        if (mi < msgs.length - 1) {
            btn.innerHTML =
                `<span class="spinner"></span>&nbsp;${msgs[++mi]}`;
        }
    }, 700);

    setTimeout(() => {

        clearInterval(ticker);

        // Estimativas conservadoras

        const operacional = amount * 0.015; // 1.5%
        const documental = amount * 0.005;  // 0.5%
        const compliance = amount * 0.003;  // 0.3%

        const total =
            operacional +
            documental +
            compliance;

        const horasEconomizadas =
            Math.round(amount / 15000);

        const score =
            95 + Math.floor(Math.random() * 4);

        result.classList.add('has-result');

        result.innerHTML = `
            <div class="result-total-label">
                Potencial de eficiência operacional anual
            </div>

            <div class="result-total">
                ${fmt(total)}
            </div>

            <div class="tax-row">
                <span class="tax-label">
                    🚢 Redução de custos operacionais
                </span>
                <span class="tax-value">
                    ${fmt(operacional)}
                </span>
            </div>

            <div class="tax-row">
                <span class="tax-label">
                    📄 Automação documental (OCR + Siscomex)
                </span>
                <span class="tax-value">
                    ${fmt(documental)}
                </span>
            </div>

            <div class="tax-row">
                <span class="tax-label">
                    🛡 Menos erros e retrabalho
                </span>
                <span class="tax-value">
                    ${fmt(compliance)}
                </span>
            </div>

            <div class="tax-row highlight">
                <span class="tax-label">
                    ⏱ Tempo administrativo recuperado
                </span>
                <span class="tax-value">
                    ${horasEconomizadas} h/ano
                </span>
            </div>

            <p class="sim-confidence">
                ★ Efficiency Score ${score}% ·
                Baseado em automação de exportação,
                integração Siscomex e gestão documental
            </p>

            <a href="#cta" class="sim-cta">
                Quero otimizar minhas exportações →
            </a>
        `;

        btn.disabled = false;

        btn.innerHTML = `
            Simular novamente
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M9 3l6 6-6 6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"/>
            </svg>
        `;

    }, 3500);
}

const simForm = document.getElementById('drawback-form');
if (simForm) simForm.addEventListener('submit', runDrawback);

// ─── SIMULADOR TABS ──────────────────────────────────────────
document.querySelectorAll('.sim-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.simTab;
        document.querySelectorAll('.sim-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.sim-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`sim-panel-${tab}`)?.classList.add('active');

        // Reset result panel to default state
        const result = document.getElementById('sim-result');
        if (result) {
            result.classList.remove('has-result');
            if (tab === 'drawback') {
                result.textContent = 'Preencha o NCM e o valor ao lado para o Tax Engine calcular sua suspensão tributária via Drawback Integrado.';
            } else if (tab === 'cambio') {
                result.textContent = 'Informe o volume de câmbio e o spread bancário atual ao lado para simular sua economia com a Navant.';
            } else {
                result.textContent = 'Informe o nome do fornecedor e o país de origem ao lado para simular a auditoria de compliance OFAC.';
            }
        }
    });
});

// ─── CÂMBIO SIMULATOR ────────────────────────────────────────
const cambioForm = document.getElementById('cambio-form');
if (cambioForm) {
    cambioForm.addEventListener('submit', e => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('sim-cambio-amount').value) || 0;
        const spread = parseFloat(document.getElementById('sim-cambio-spread').value) || 0;
        const btn = document.getElementById('sim-cambio-btn');
        const result = document.getElementById('sim-result');

        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span>&nbsp;Consultando cotações em tempo real...`;

        setTimeout(() => {
            const usdRate = 5.15;
            const bankCost = amount * (spread / 100) * usdRate;
            const navantCost = amount * 0.005 * usdRate;
            const savings = bankCost - navantCost;

            result.classList.add('has-result');
            result.innerHTML = `
                <div class="result-total-label">Economia Cambial Anual Estimada (Capital)</div>
                <div class="result-total" style="color:var(--primary-blue)">${fmt(savings)}</div>
                <div class="tax-row">
                    <span class="tax-label">Volume Cambial Solicitado</span>
                    <span class="tax-value">U$ ${amount.toLocaleString('pt-BR')}</span>
                </div>
                <div class="tax-row">
                    <span class="tax-label">Custo no seu Banco (${spread.toFixed(1)}% spread)</span>
                    <span class="tax-value" style="color:var(--red)">${fmt(bankCost)}</span>
                </div>
                <div class="tax-row highlight">
                    <span class="tax-label">Custo na Navant Ecomex (0.5% spread)</span>
                    <span class="tax-value" style="color:var(--primary-blue)">${fmt(navantCost)}</span>
                </div>
                <p class="sim-confidence">★ Liquidação D+0 inclusa · Proteção cambial (NDF) contratada em tempo real</p>
                <a href="#cta" class="sim-cta" style="background:var(--primary-blue)">Habilitar Câmbio D+0 →</a>
            `;
            btn.disabled = false;
            btn.innerHTML = `Simular outro valor`;
        }, 1500);
    });
}

// ─── COMPLIANCE SIMULATOR ────────────────────────────────────
const complianceForm = document.getElementById('compliance-form');
const compNameSelect = document.getElementById('sim-comp-name');
if (compNameSelect) {
    compNameSelect.addEventListener('change', e => {
        const opt = e.target.options[e.target.selectedIndex];
        const country = opt.getAttribute('data-country');
        const countrySelect = document.getElementById('sim-comp-country');
        if (countrySelect && country) {
            countrySelect.value = country;
        }
    });
}

if (complianceForm) {
    complianceForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('sim-comp-name').value;
        const country = document.getElementById('sim-comp-country').value;
        const btn = document.getElementById('sim-comp-btn');
        const result = document.getElementById('sim-result');

        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span>&nbsp;Conectando a bases aduaneiras...`;

        const msgs = [
            "Conectando a base OFAC SDN...",
            "Cruzando dados societários na origem...",
            "Auditando listas Interpol e ONU...",
            "Finalizando dossiê de auditoria..."
        ];
        let mi = 0;
        const ticker = setInterval(() => {
            if (mi < msgs.length - 1) btn.innerHTML = `<span class="spinner"></span>&nbsp;${msgs[++mi]}`;
        }, 500);

        setTimeout(() => {
            clearInterval(ticker);
            result.classList.add('has-result');

            if (country === 'RU') {
                result.innerHTML = `
                    <div class="result-total-label" style="color:var(--red)">🚨 EMBARGO ALCANDEGÁRIO DETECTADO</div>
                    <div class="result-total" style="color:var(--red); font-size:1.6rem; margin-bottom:12px;">Transação Bloqueada</div>
                    <p style="font-size:0.8rem; line-height:1.5; color:var(--text-b); margin-bottom:16px;">
                        A entidade <strong>${name}</strong> (Rússia) foi identificada em listas de sanções ativas da <strong>OFAC SDN</strong> e diretrizes aduaneiras brasileiras de restrição.
                    </p>
                    <div class="tax-row" style="border-color:var(--red-b); background:var(--red-l)">
                        <span class="tax-label" style="color:var(--red)">KYB Score / Risco</span>
                        <span class="tax-value" style="color:var(--red)">12 / 100 (Risco Crítico)</span>
                    </div>
                    <div class="tax-row">
                        <span class="tax-label">Listas Atingidas</span>
                        <span class="tax-value">OFAC SDN, UK Russia Sanctions</span>
                    </div>
                    <p class="sim-confidence" style="color:var(--red)">⚠️ Atenção: Fechar contrato com este parceiro pode acarretar multas e bloqueio aduaneiro de 3 a 9 meses.</p>
                `;
            } else {
                const score = 94 + Math.floor(Math.random() * 6);
                result.innerHTML = `
                    <div class="result-total-label" style="color:var(--emerald)">✓ CONFORMIDADE CONFIRMADA</div>
                    <div class="result-total" style="color:var(--emerald); font-size:1.6rem; margin-bottom:12px;">Fornecedor Aprovado</div>
                    <p style="font-size:0.8rem; line-height:1.5; color:var(--text-b); margin-bottom:16px;">
                        Auditoria de compliance concluída para <strong>${name}</strong>. Nenhuma ocorrência ativa encontrada em listas restritivas internacionais ou base da Receita Federal.
                    </p>
                    <div class="tax-row" style="border-color:var(--emerald-b); background:var(--emerald-l)">
                        <span class="tax-label" style="color:var(--emerald)">KYB Score / Conformidade</span>
                        <span class="tax-value" style="color:var(--emerald)">${score} / 100 (Excelente)</span>
                    </div>
                    <div class="tax-row">
                        <span class="tax-label">Status da Análise</span>
                        <span class="tax-value">Aprovado (OFAC, Interpol, ONU OK)</span>
                    </div>
                    <p class="sim-confidence" style="color:var(--text-m)">★ Dossiê de homologação gerado e arquivado para auditorias do RADAR.</p>
                    <a href="#cta" class="sim-cta" style="background:var(--emerald); border-color:var(--emerald)">Gerar Certificado Completo →</a>
                `;
            }
            btn.disabled = false;
            btn.innerHTML = `Auditar outro fornecedor`;
        }, 2200);
    });
}

// ─── CTA HANDLER ─────────────────────────────────────────────
function handleCTA() {
    const fields = {
        empresa: document.getElementById('cta-empresa'),
        nome: document.getElementById('cta-nome'),
        email: document.getElementById('cta-email'),
        phone: document.getElementById('cta-phone'),
    };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email?.value || '');
    const allFilled = Object.values(fields).every(f => f?.value?.trim());

    if (!allFilled || !emailOk) {
        Object.values(fields).forEach(f => {
            if (!f?.value?.trim() || (f === fields.email && !emailOk)) {
                f.style.borderColor = 'rgba(239,68,68,0.5)';
                f.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)';
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
            email.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)';
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
s.textContent = `.nav-active { color: var(--primary-blue) !important; } .nav-active::after { width: 100% !important; }`;
document.head.appendChild(s);
