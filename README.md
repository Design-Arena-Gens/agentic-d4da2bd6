# Planner (R$ 19,90/mês)

App simples e moderno para organizar o dia com anotações e tarefas. Pensado para Vercel.

## Funcionalidades
- Notas rápidas e tarefas
- Limites no plano gratuito (50 notas / 100 tarefas)
- Plano Pro (R$ 19,90/mês): ilimitado + extras
- UI moderna (TailwindCSS)

## Execução local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build && npm start
```

## Checkout
Defina `NEXT_PUBLIC_CHECKOUT_URL` para um link de checkout real (ex.: Stripe Payment Link). Sem isso, o app ativa Pro em modo demonstração.

## Deploy (Vercel)
```bash
VERCEL_TOKEN=... npx vercel deploy --prod --yes --name agentic-d4da2bd6
```
