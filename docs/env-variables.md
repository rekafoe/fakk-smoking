# Переменные окружения

Приложение — один Next.js на **Vercel**; **Railway** — только PostgreSQL.

## Сводная таблица

| Переменная | Где задать | Обязательно | Назначение |
|------------|------------|-------------|------------|
| `DATABASE_URL` | Vercel (+ локально `.env`) | да | Prisma → PostgreSQL (URL из Railway) |
| `NEXTAUTH_SECRET` | Vercel (+ локально `.env`) | да | Подпись JWT сессий NextAuth |
| `NEXTAUTH_URL` | Vercel (+ локально `.env`) | да | Базовый URL сайта для NextAuth |
| `DATABASE_URL` (и `PG*`) | Railway Postgres | авто | Создаёт плагин Postgres; копируется в Vercel |

Других переменных для MVP нет. `NODE_ENV` на Vercel выставляется сам.

## Railway (только БД)

1. **New Project** → **Provision PostgreSQL**
2. Сервис Postgres → **Variables** / **Connect**
3. Скопировать **`DATABASE_URL`** или **`DATABASE_PUBLIC_URL`** (если internal URL недоступен с Vercel)

Шаблон-справка: [env/railway.postgres.env.example](../env/railway.postgres.env.example).

На Railway **не** деплоится код репозитория и **не** нужны `NEXTAUTH_*`.

## Vercel (приложение)

**Settings → Environment Variables → Production:**

| Ключ | Значение |
|------|----------|
| `DATABASE_URL` | из Railway, с `?sslmode=require` при необходимости |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://<project>.vercel.app` или свой домен |

Шаблон: [env/vercel.production.env.example](../env/vercel.production.env.example).

Preview-деплои: [env/vercel.preview.env.example](../env/vercel.preview.env.example) — те же ключи; `NEXTAUTH_URL` должен совпадать с URL открытого preview.

## Локальная разработка

```bash
cp .env.example .env
```

Заполнить `DATABASE_URL` (Docker Postgres или Railway), `NEXTAUTH_SECRET`, `NEXTAUTH_URL=http://localhost:3000`.

## Безопасность

- Не коммитить `.env`, `env/*.local`, реальные пароли
- Один `NEXTAUTH_SECRET` на production; смена секрета сбрасывает все сессии

## Связанные документы

- [deploy-railway-vercel.md](deploy-railway-vercel.md) — чеклист деплоя
- [env/README.md](../env/README.md) — файлы-шаблоны
