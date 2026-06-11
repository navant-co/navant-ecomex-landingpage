# Marketing Ecomex — CLAUDE.md

## Papel no Ecossistema
Landing page estática de marketing da família **Ecomex**, publicada via **GitHub Pages** (tem `CNAME` para domínio customizado).

## Estrutura
```
marketing-ecomex/
├── index.html   # Página única
├── main.js      # Interações
├── style.css    # Estilos
└── CNAME        # Domínio do GitHub Pages
```

## Diretrizes
- Site estático puro (sem build) — manter simples; mudanças entram no ar via push para o branch do Pages
- Não duplicar com `navant-ecomex-frontend/apps/navant-website` (Next.js) — decidir qual será o site de marketing canônico e aposentar o outro
- CTAs devem apontar para o fluxo de demo/login do produto

## Prod-Readiness
- ⚠️ **Sobreposição com `navant-website`** (Next.js no monorepo ecomex-frontend) — consolidar
- 🔴 Sem analytics/SEO estruturado (meta tags, OG, sitemap)
