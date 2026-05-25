import articlesEn from "@/content/daily-articles.en.json";
import articlesPl from "@/content/daily-articles.pl.json";
import quotesEn from "@/content/daily-quotes.en.json";
import quotesPl from "@/content/daily-quotes.pl.json";
import type { Locale } from "@/i18n";

export type DailyArticle = {
  day: number;
  title: string;
  excerpt: string;
  paragraphs: string[];
};

const quotesByLocale: Record<Locale, string[]> = {
  en: quotesEn as string[],
  pl: quotesPl as string[],
};

const articlesByLocale: Record<Locale, DailyArticle[]> = {
  en: articlesEn as DailyArticle[],
  pl: articlesPl as DailyArticle[],
};

export function contentDayIndex(daysWithoutNicotine: number): number {
  return Math.max(0, daysWithoutNicotine) % 365;
}

export function getDailyQuote(daysWithoutNicotine: number, locale: Locale): string {
  return quotesByLocale[locale][contentDayIndex(daysWithoutNicotine)];
}

export function getDailyArticle(daysWithoutNicotine: number, locale: Locale): DailyArticle {
  return articlesByLocale[locale][contentDayIndex(daysWithoutNicotine)];
}

export function getContentDayNumber(daysWithoutNicotine: number): number {
  return contentDayIndex(daysWithoutNicotine) + 1;
}

export function getRandomQuote(locale: Locale): string {
  const quotes = quotesByLocale[locale];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
