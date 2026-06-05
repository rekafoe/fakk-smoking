import articlesEn from "@/content/daily-articles.en.json";
import quotesEn from "@/content/daily-quotes.en.json";

export type DailyArticle = {
  day: number;
  title: string;
  excerpt: string;
  paragraphs: string[];
};

export function contentDayIndex(daysWithoutNicotine: number): number {
  return Math.max(0, daysWithoutNicotine) % 365;
}

export function getDailyQuote(daysWithoutNicotine: number): string {
  return quotesEn[contentDayIndex(daysWithoutNicotine)];
}

export function getDailyArticle(daysWithoutNicotine: number): DailyArticle {
  return articlesEn[contentDayIndex(daysWithoutNicotine)] as DailyArticle;
}

export function getContentDayNumber(daysWithoutNicotine: number): number {
  return contentDayIndex(daysWithoutNicotine) + 1;
}

export function getRandomQuote(): string {
  return quotesEn[Math.floor(Math.random() * quotesEn.length)];
}
