# Переменные окружения (Vercel + Railway)

| Файл | Куда |
|------|------|
| [vercel.production.env.example](vercel.production.env.example) | Vercel → **Production** |
| [vercel.preview.env.example](vercel.preview.env.example) | Vercel → **Preview** (по желанию) |
| [railway.postgres.env.example](railway.postgres.env.example) | Справка: что даёт Railway Postgres |
| [../.env.example](../.env.example) | Локально: `.env` |

## Порядок настройки

1. **Railway** — только PostgreSQL. Скопировать `DATABASE_URL` (лучше публичный URL с `sslmode=require`).
2. **Vercel** — вставить три переменные из `vercel.production.env.example`.
3. **Deploy** — миграции накатятся при сборке (`vercel.json`).

Подробно: [docs/deploy-railway-vercel.md](../docs/deploy-railway-vercel.md), [docs/env-variables.md](../docs/env-variables.md).

## CLI (опционально)

```bash
# из корня репозитория, после vercel link
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

Не коммитьте файлы с реальными секретами (`env/*.local`, `.env.vercel`).
