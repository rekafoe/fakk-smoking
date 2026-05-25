# Типичные задачи

## Фоновый дым (BackgroundEffects)

Реализация: Canvas 2D в `src/lib/smoke-canvas.ts` + `BackgroundEffects.tsx`. Параметры wisps (количество, скорость, opacity) — в `smoke-canvas.ts`. Стили слоя: `BackgroundEffects.module.css` (opacity, blur, vignette).

`prefers-reduced-motion`: статичный кадр, без `requestAnimationFrame`.

Альтернатива — loop video в `public/video/` (webm с чёрным ключом), см. комментарий в README при добавлении ассета.

## Сменить фон

Фон страницы — `--color-bg` в `globals.css` (`.app-shell::before`). Картинка `bg-smoke.png` не используется.

## Добавить цитату

`src/lib/quotes.ts` — массив `MOTIVATION_QUOTES`.

## Изменить вехи healing

`src/lib/healing.ts` — константа `MILESTONES_DAYS`.

## Dev: 500 на GET /, vendor-chunks, webpack cache

Симптомы:

- `GET / 500`, затем снова `GET / 200` после hot reload
- `Cannot find module './vendor-chunks/next-auth.js'` (часто после `Compiling /api/auth/[...nextauth]`)
- `SegmentViewNode` / `React Client Manifest` (dev-only, Next 15.5 + Windows)
- `PackFileCacheStrategy Caching failed: ENOENT`
- `Cannot read properties of undefined (reading 'call')`

Причина: повреждённый или частично удалённый `.next` при параллельных `next dev`, смене компонентов или HMR во время компиляции auth. На Windows помогает полная очистка с остановкой портов.

**Windows (рекомендуется):**

```bash
npm run dev:clean:win
```

Останавливает процессы на 3000/3001, удаляет `.next` и `node_modules/.cache`, запускает `next dev` с `NEXT_TELEMETRY_DISABLED=1`.

Только очистка:

```bash
npm run clean:win
npx prisma generate
npm run dev
```

**macOS / Linux:**

```bash
npm run dev:clean
```

Проверка прод-сборки после очистки:

```bash
npm run clean:win
npx prisma generate
npm run build
npm run dev
```

### Границы client/server

| Модуль | Директива |
|--------|-----------|
| `layout.tsx` | Server (импортирует клиентский `Providers`) |
| `Providers`, `BackgroundEffects`, `Dashboard`, `PrimaryActions` | `"use client"` |
| `CigaretteAccent`, `GlitchTitle` | `"use client"` (декор внутри клиентского `Dashboard`) |
| `page.tsx` (`/`) | Server: `getServerSession` → `<Dashboard />` |
| `api/auth/[...nextauth]/route.ts` | `runtime = "nodejs"` |

Не импортируйте `@/lib/auth` (Prisma) в клиентские компоненты — только в server pages и API routes.

### next-auth и Next 15.5

В проекте: **next-auth@4.24.x** + **Next 15.5.x** (Credentials, App Router). Совместимо; сбои в dev обычно из кэша, не из версии. В `next.config.ts`: `runtime: "nodejs"` на auth route, `devIndicators: false`, на Windows в dev отключён webpack disk cache. Не выносите `next-auth/react` в `serverExternalPackages` — ломает prerender `SessionProvider`. Миграция на Auth.js v5 — отдельная задача.

## Windows: EPERM на `.next\trace`, порт 3000 занят

Симптомы:

- `Error: EPERM: operation not permitted, open '...\.next\trace'`
- `Port 3000 in use by process …, using 3001`

Причина: старый `node` / `next dev` держит файл `trace` и порт; `npm run clean` без остановки процесса удаляет `.next` не полностью.

**Быстро (рекомендуется):**

```bash
npm run dev:clean:win
```

Останавливает слушатели на 3000/3001, удаляет `.next`, запускает dev с `NEXT_TELEMETRY_DISABLED=1`.

Только очистка без запуска:

```bash
npm run clean:win
npm run dev
```

**Вручную в PowerShell** (из корня проекта):

```powershell
# 1) Кто слушает 3000 / 3001
Get-NetTCPConnection -LocalPort 3000,3001 -State Listen -ErrorAction SilentlyContinue |
  Select-Object LocalPort, OwningProcess

# 2) Остановить (подставьте PID из вывода, например 27504)
Stop-Process -Id 27504 -Force

# 3) При необходимости — все node (осторожно: закроет другие Node-проекты)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 4) Удалить кэш
Remove-Item -Recurse -Force .next

# 5) Запуск
$env:NEXT_TELEMETRY_DISABLED = "1"
npm run dev
```

Если `.next` не удаляется — закройте терминалы с `next dev` в Cursor/VS Code, проверьте Диспетчер задач (`node.exe`), при необходимости добавьте папку проекта в исключения Windows Defender.

Файл `.next\trace` — служебный trace сборки Next.js, не телеметрия Vercel; отключить его в `next.config` нельзя, нужно освободить файл (остановить dev/build).

## Продакшен

1. `NEXTAUTH_SECRET` — криптостойкая строка  
2. `NEXTAUTH_URL` — публичный URL  
3. SQLite → Postgres при нагрузке  
4. `npm run build && npm start`

## Перегенерировать цитаты и статьи на год

```bash
npm run generate:content
```

Правки шаблонов — `scripts/generate-daily-content.mjs`.

## Изменить формулы сбережений

`src/lib/savings.ts` — минуты на сигарету и расчёт денег.

## Emergency на русском

Тексты в `EmergencyPanel`, `reasons.ts`, `quotes.ts` — заменить или вынести в `messages/ru.ts`.
