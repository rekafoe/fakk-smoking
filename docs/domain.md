# Доменные термины

| Термин | Описание |
|--------|----------|
| **Quit date** | Календарный день, с которого пользователь не курит. Хранится в `User.quitDate`. |
| **Days without nicotine** | Календарные дни с quit date (`quit-date.ts`, дата из `YYYY-MM-DD` без сдвига TZ). |
| **Smoke-free day (циферблат)** | Номер дня пути: `completedDays + 1` — совпадает с «День N» в цитате/статье. |
| **Healing progress** | Процент до 365 дней; 4 сегмента бара — вехи 2, 14, 30, 90 дней. |
| **Emergency** | Режим при тяге: дыхание, цитата, таймер 3:00, тексты «почему не срываться». |
| **День контента** | `daysWithoutNicotine % 365` → цитата и статья из `src/content/*.en.json`. |
| **Locale** | Только `en` — UI (`src/i18n/locales/en.ts`), поле `User.locale` в БД сохраняется, в приложении всегда English. |
| **Smoking habits** | `cigarettesPerDay`, `pricePerPack`, `cigarettesPerPack` (по умолчанию 20), `currency` (по умолчанию RUB). |
| **Money saved** | `cigarettesAvoided × (pricePerPack / cigarettesPerPack)`. |
| **Time saved** | 5 минут на каждую несокуренную сигарету. |
| **Life reclaimed** | 11 минут на сигарету (оценочная метрика). |
| **Relapse event** | Запись о срыве: `RelapseEvent` (дата/время, опциональная заметка). Не меняет `quitDate` и счётчик дней автоматически. |
| **Relapse log** | Последние события в настройках; общее число — бейдж. |

## Срыв (UX)

- Кнопка «I slipped» / «Miałem chwilę słabości» — дашборд, emergency, настройки.
- После записи — случайная по счётчику поддерживающая фраза (i18n).
- Новый счётчик дней только если пользователь вручную меняет **quit date** в настройках.

## Milestones (сегменты бара)

1. 2 дня  
2. 14 дней  
3. 30 дней  
4. 90 дней  

Процент на экране — `min(100, days / 365 * 100)`.
