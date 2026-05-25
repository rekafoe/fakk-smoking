# Замечания клиента и ответы

## Графика / производительность

**Отзыв:** «Графика супер. Только лагает пиздец.»

**Сделано:**
- Тiers: `full` | `lite` | `static` ([`src/lib/motion-profile.ts`](../src/lib/motion-profile.ts))
- **lite** (мобилка ≤900px, слабый CPU, save-data): без canvas, 2 слоя дыма, 1 вспышка, без `backdrop-filter`
- **full**: canvas 30 FPS, cap DPR 1.5, меньше wisps, упрощённый draw
- На `html` выставляется `data-motion` для CSS-оптимизаций

## Калькулятор денег и сигарет

**Отзыв:** «Круто придумал… То что надо!»

**Действие:** не менять логику [`StatsPanel`](../src/components/StatsPanel.tsx) / [`savings.ts`](../src/lib/savings.ts).

## Дизайн vs Bucci Studio

**Отзыв:** «Как будто 2010… немного дёшево», стиль ближе к BUCCI STUDIO / мерч.

**Сделано (редакционный refresh):**
- UI-шрифт: **Inter** (вместо Barlow Condensed)
- Острые углы `2px`, меньше «glass 2010» теней
- Плоские кнопки, меньше `letter-spacing` на лейблах
- Лёгче blur (10px) на desktop; отключение blur на lite

**Дальше (бэклог под мерч BUCCI):**
- Референс палитры/сетки с buccistudio.com
- Кастомный wordmark вместо Anton на логотипе
- Фото/текстуры с мерча в `public/`
- Auth UI по [auth-improvement-plan.md](auth-improvement-plan.md)
