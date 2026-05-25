# Деплой: Railway (PostgreSQL) + Vercel (Next.js)

## Схема

```mermaid
flowchart LR
  User --> Vercel["Vercel — Next.js"]
  Vercel --> RailwayDB["Railway — PostgreSQL"]
```

- **Vercel** — приложение, HTTPS, домен
- **Railway** — только база данных
- **SQLite** (`dev.db`) в проде не используется; локально — тот же PostgreSQL (Docker или Railway dev)

## 1. Railway: PostgreSQL

1. [railway.app](https://railway.app) → **New Project** → **Provision PostgreSQL**
2. Откройте сервис Postgres → **Variables** (или **Connect**)
3. Скопируйте **`DATABASE_URL`** (публичный URL с SSL для Vercel)
4. По желанию включите **backups** в настройках плана

Формат URL:

```text
postgresql://USER:PASSWORD@HOST:PORT/railway?sslmode=require
```

## 2. Локальная разработка (PostgreSQL)

Скопируйте `.env.example` в `.env` и укажите `DATABASE_URL`.

**Docker (один контейнер):**

```bash
docker run --name fakk-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fakk -p 5432:5432 -d postgres:16
```

В `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fakk?schema=public"
```

Применить миграции:

```bash
npx prisma migrate deploy
npm run dev
```

## 3. Vercel: проект и переменные

1. Импортируйте репозиторий на [vercel.com](https://vercel.com) (Framework: **Next.js**)
2. **Settings → Environment Variables** (Production, Preview, Development по необходимости):

| Переменная | Значение |
|------------|----------|
| `DATABASE_URL` | из Railway |
| `NEXTAUTH_SECRET` | длинная случайная строка (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://<your-app>.vercel.app` или ваш домен |

3. Сборка задаётся в `vercel.json`:

```json
"buildCommand": "prisma migrate deploy && prisma generate && next build"
```

`npm run build` локально — только `prisma generate && next build` (без миграций, если нет БД).

4. **Deploy** — при первом деплое Prisma применит `prisma/migrations/*` к Railway.

## 4. Первый деплой (чеклист)

- [ ] Postgres на Railway, `DATABASE_URL` скопирован
- [ ] Репозиторий подключён к Vercel
- [ ] В Vercel заданы `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (прод URL)
- [ ] Деплой прошёл без ошибок в Build Logs (`prisma migrate deploy`)
- [ ] Открыть сайт → регистрация → dashboard

## 5. Свой домен

1. Vercel → **Project → Settings → Domains** → добавить домен, настроить DNS (CNAME / A по подсказкам Vercel)
2. Обновить **`NEXTAUTH_URL`** на `https://your-domain.com` (Production)
3. **Redeploy** production

## 6. Полезные команды

```bash
npm run db:migrate    # prisma migrate deploy (CI / вручную)
npm run build         # локальная prod-сборка без migrate
```

## 7. Безопасность

- Не коммитьте `.env`, пароли и `NEXTAUTH_SECRET`
- `DATABASE_URL` только в Vercel / Railway variables, не в git

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| Build: `migrate deploy` failed | Проверить `DATABASE_URL`, доступ Railway с интернета, SSL |
| Login loop / 401 | `NEXTAUTH_URL` должен совпадать с URL в браузере |
| P1001 Can't reach database | Firewall Railway, неверный host/port |
