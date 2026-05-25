# Fakk Smoking

Трекер отказа от курения: дни без никотина, прогресс восстановления, кнопка экстренной помощи при тяге.

## Запуск (локально)

Требуется **PostgreSQL** (см. [docs/deploy-railway-vercel.md](docs/deploy-railway-vercel.md) — Docker или Railway).

```bash
npm install
cp .env.example .env   # задайте DATABASE_URL и NEXTAUTH_SECRET
npx prisma migrate deploy
npm run dev
```

При 500 или сбоях webpack-кэша в dev: `npm run dev:clean` (см. [docs/typical-tasks.md](docs/typical-tasks.md)).

**Windows** (`EPERM` на `.next\trace`, порт 3000 занят): `npm run dev:clean:win` — см. раздел в [docs/typical-tasks.md](docs/typical-tasks.md).

Откройте [http://localhost:3000](http://localhost:3000).

1. **Регистрация** — `/register`
2. **Дата отказа** — при первом входе
3. **Онбординг** — дата отказа + сигарет в день + цена пачки
4. **Dashboard** — дни, healing bar, блок статистики (деньги, не выкурено, время, «жизнь»)
5. **Settings** — изменить дату и привычки
6. **I want to smoke** — дыхание 4-4-6, мотивация, таймер 3 минуты, причины не срываться

## Переменные окружения

| Среда | Файл-шаблон |
|-------|-------------|
| Локально | `.env.example` → `.env` |
| Vercel Production | [env/vercel.production.env.example](env/vercel.production.env.example) |
| Vercel Preview | [env/vercel.preview.env.example](env/vercel.preview.env.example) |
| Railway Postgres | [env/railway.postgres.env.example](env/railway.postgres.env.example) (что копировать в Vercel) |

Подробно: [docs/env-variables.md](docs/env-variables.md).

## Деплой (продакшен)

**Railway** — PostgreSQL. **Vercel** — Next.js.

Пошагово: [docs/deploy-railway-vercel.md](docs/deploy-railway-vercel.md).

Кратко: скопировать `DATABASE_URL` из Railway в Vercel, задать `NEXTAUTH_*`, деплой применит миграции через `vercel.json` (`prisma migrate deploy`).

## Документация

- [docs/architecture.md](docs/architecture.md)
- [docs/deploy-railway-vercel.md](docs/deploy-railway-vercel.md)
- [docs/domain.md](docs/domain.md)
- [docs/typical-tasks.md](docs/typical-tasks.md)
- [docs/env-variables.md](docs/env-variables.md)
- [docs/auth-improvement-plan.md](docs/auth-improvement-plan.md)
- [docs/client-feedback.md](docs/client-feedback.md)
