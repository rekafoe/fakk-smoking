# Админка и аналитика

## Доступ

- URL: `/admin` (не показывается в UI обычным пользователям).
- Требуется вход + роль **`ADMIN`** в таблице `User`.
- API: `/api/admin/overview`, `/api/admin/users`, `/api/admin/timeseries` — те же права.

### Назначить первого админа

После деплоя и миграции:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Или через Prisma Studio: `npm run db:studio` → `User.role` = `ADMIN`.

## Метрики

| Блок | Источник |
|------|----------|
| Page views | `PageView` |
| Unique visitors | distinct `userId` или `visitorId` в `PageView` |
| Registrations | `User.createdAt` |
| Active users | `User.lastSeenAt` за период |
| Emergency opens | `AnalyticsEvent` type `emergency_open` |
| Relapses | `AnalyticsEvent` type `relapse_logged` (+ `RelapseEvent`) |

Периоды в сводке: **today**, **7d**, **30d** (календарные дни **UTC**).

## Сбор данных

- **Просмотры страниц:** `POST /api/analytics/event` `{ "kind": "page_view", "path": "/..." }` — хук `usePageView` в `Providers`.
- **Вход:** NextAuth `signIn` → `login_success`.
- **Регистрация:** `POST /api/register` → `register_success`.
- **Emergency:** открытие панели → `emergency_open`.
- **Срыв:** `POST /api/relapse` → `relapse_logged`.

Гости получают cookie `fs_visitor` (httpOnly) для уникальных визитов без аккаунта.

## Переменные окружения

| Переменная | По умолчанию | Назначение |
|------------|--------------|------------|
| `ANALYTICS_ENABLED` | включено | `false` — не писать события в БД |

## Privacy (MVP)

- IP и User-Agent **не** сохраняются.
- Только path, userId (если есть), анонимный visitorId.

## Связанные файлы

- [`src/lib/analytics.ts`](../src/lib/analytics.ts)
- [`src/lib/admin.ts`](../src/lib/admin.ts)
- [`src/lib/admin-stats.ts`](../src/lib/admin-stats.ts)
- [`src/app/admin/page.tsx`](../src/app/admin/page.tsx)
