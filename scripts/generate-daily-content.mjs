import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "src", "content");

const LANGS = {
  en: {
    quoteOpeners: [
      "Today you are stronger than a cigarette.",
      "This day is another gift to your lungs.",
      "The craving will pass. You will remain.",
      "You are not losing a habit — you are reclaiming yourself.",
      "Every smoke-free hour is a win.",
      "You have already proved you can do this.",
      "Nicotine whispers — you do not have to listen.",
      "Breathe. Live. Choose yourself.",
      "A relapse will not fix stress — it will deepen it.",
      "Your body thanks you for today.",
      "Freedom smells like fresh air, not tobacco.",
      "You are not alone in this fight.",
      "Tomorrow-you will be grateful.",
      "A cigarette is not a reward — it is a cage.",
      "You are teaching your brain a new normal.",
      "Calm without nicotine is possible.",
      "You take another day back from addiction.",
      "Strength lives in the pause before relapse.",
      "You deserve a life without coughing.",
      "Every cigarette refused is an investment.",
    ],
    quoteMiddles: [
      "Day {d} without nicotine is {d} steps toward yourself.",
      "{d} {dayWord} in — do not reset the path.",
      "You are {d} {dayWord} into the run — the finish is closer.",
      "Remember: you chose to quit {d} {dayWord} ago. That was right.",
      "{d} {dayWord} is long enough to be proud.",
    ],
    quoteClosers: [
      "Hold the line.",
      "You can handle today.",
      "One day at a time.",
      "Do not give this day back.",
      "Keep going.",
      "It is worth it.",
      "You are on the right side.",
    ],
    dayWord: (n) => (n === 1 ? "day" : "days"),
  },
  pl: {
    quoteOpeners: [
      "Dziś jesteś silniejszy niż papieros.",
      "Ten dzień to kolejny prezent dla płuc.",
      "Głód minie. Ty zostaniesz.",
      "Nie tracisz nawyku — odzyskujesz siebie.",
      "Każda godzina bez dymu to wygrana.",
      "Już udowodniłeś, że dasz radę.",
      "Nikotyna szepcze — nie musisz słuchać.",
      "Oddychaj. Żyj. Wybieraj siebie.",
      "Potencjalny relapse nie rozwiąże stresu.",
      "Twoje ciało dziękuje za ten dzień.",
      "Wolność pachnie świeżością, nie tytoniem.",
      "Nie jesteś w tym sam.",
      "Jutrzejszy Ty będzie wdzięczny.",
      "Papieros to nie nagroda — to klatka.",
      "Uczysz mózg nowej normy.",
      "Spokój bez nikotyny jest możliwy.",
      "Odbierasz uzależnieniu kolejny dzień.",
      "Siła jest w pauzie przed zapłonem.",
      "Zasługujesz na życie bez kaszlu.",
      "Każda odmowa to inwestycja.",
    ],
    quoteMiddles: [
      "Dzień {d} bez nikotyny to {d} kroków do siebie.",
      "{d} {dayWord} za Tobą — nie zeruj drogi.",
      "Masz {d} {dayWord} biegu — meta jest bliżej.",
      "Pamiętaj: rzuciłeś {d} {dayWord} temu. To była dobra decyzja.",
      "{d} {dayWord} to wystarczająco, by być dumnym.",
    ],
    quoteClosers: [
      "Trzymaj linię.",
      "Dasz radę dziś.",
      "Jeden dzień na raz.",
      "Nie oddawaj tego dnia.",
      "Idź dalej.",
      "Warto.",
      "Jesteś po właściwej stronie.",
    ],
    dayWord: (n) => {
      if (n === 1) return "dzień";
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "dni";
      return "dni";
    },
  },
};

function buildQuotes(lang) {
  const L = LANGS[lang];
  const quotes = [];
  const used = new Set();
  for (let d = 1; d <= 365; d++) {
    let q = "";
    for (let attempts = 0; attempts < 50; attempts++) {
      const o = L.quoteOpeners[(d + attempts) % L.quoteOpeners.length];
      const m = L.quoteMiddles[(d * 3 + attempts) % L.quoteMiddles.length]
        .replace(/\{d\}/g, String(d))
        .replace(/\{dayWord\}/g, L.dayWord(d));
      const c = L.quoteClosers[(d * 7 + attempts) % L.quoteClosers.length];
      q = `${o} ${m} ${c}`;
      if (!used.has(q)) break;
    }
    used.add(q);
    quotes.push(q);
  }
  return quotes;
}

const articleTopics = {
  en: [
    {
      title: "Your brain without nicotine",
      excerpt: "How receptors adapt and why early weeks feel rough.",
      body: (d) => [
        `On day ${d} without smoking, your brain is rewiring dopamine pathways. Nicotine faked pleasure for years — now your body relearns reward without smoke.`,
        `Irritability is withdrawal, not weakness. Each smoke-free day speeds a more stable mood.`,
        `When craving hits: wait 10 minutes, drink water, walk. You are building new rituals.`,
      ],
    },
    {
      title: "Lungs: first changes",
      excerpt: "Mucus, cough, and why that can mean recovery.",
      body: (d) => [
        `By day ${d}, airway cilia are recovering. Cough may increase as tar clears.`,
        `Oxygen use improves; light walks support healing and cut cravings.`,
        `Temporary discomfort is often cleanup, not decline. See a doctor if worried.`,
      ],
    },
    {
      title: "Cravings: the 3–5 minute wave",
      excerpt: "Why urges peak fast and how to outlast them.",
      body: (d) => [
        `Day ${d}: cravings rarely last forever. Peaks are often 3–5 minutes.`,
        `Note today's trigger: coffee, stress, after meals. Awareness breaks autopilot.`,
        `Try 4-4-6 breathing for four cycles — often the peak fades before you expect.`,
      ],
    },
    {
      title: "Money you keep",
      excerpt: "Why pack price on your profile matters.",
      body: (d) => [
        `Over ${d} days you already avoided real spend on nicotine. That is concrete, not abstract.`,
        `Addiction says "one cigarette costs nothing." A year says otherwise. Watch the dashboard counter.`,
        `Tip: move one pack's price into a "freedom fund" you can see.`,
      ],
    },
    {
      title: "Myth: smoking relieves stress",
      excerpt: "Nicotine creates tension, then masks it.",
      body: (d) => [
        `Day ${d}: baseline stress can fall as nicotine leaves. The cigarette treated withdrawal, not life.`,
        `Real tools: sleep, walks, talking, journaling, cold water, stretch.`,
        `Hard day ≠ reason to quit quitting. Use emergency mode on the site.`,
      ],
    },
  ],
  pl: [
    {
      title: "Mózg bez nikotyny",
      excerpt: "Jak adaptują się receptory i dlaczego pierwsze tygodnie są trudne.",
      body: (d) => [
        `Dzień ${d} bez palenia: mózg przebudowuje ścieżki dopaminy. Nikotyna fałszowała nagrodę — teraz uczysz się bez dymu.`,
        `Drażliwość to odstawienie, nie słabość. Każdy dzień bez papierosa stabilizuje nastrój.`,
        `Przy głodzie: 10 minut zwłoki, woda, spacer. Budujesz nowe rytuały.`,
      ],
    },
    {
      title: "Płuca: pierwsze zmiany",
      excerpt: "Śluz, kaszel i dlaczego to może być regeneracja.",
      body: (d) => [
        `Do dnia ${d} rzęski dróg oddechowych wracają do pracy. Kaszel może wzrosnąć — to oczyszczanie.`,
        `Lepsze dotlenienie; lekki spacer wspiera płuca i obcina głód.`,
        `Dyskomfort często to sprzątanie, nie pogorszenie. Lekarz, gdy masz wątpliwości.`,
      ],
    },
    {
      title: "Głód: fala 3–5 minut",
      excerpt: "Dlaczego szczyt jest krótki i jak go przetrwać.",
      body: (d) => [
        `Dzień ${d}: głód rzadko trwa wiecznie. Szczyt to często 3–5 minut.`,
        `Zapisz dziś trigger: kawa, stres, po jedzeniu. Świadomość psuje autopilot.`,
        `Oddech 4-4-6 przez cztery cykle — szczyt często mija sam.`,
      ],
    },
    {
      title: "Pieniądze, które zostają",
      excerpt: "Po co cena paczki w profilu.",
      body: (d) => [
        `Przez ${d} dni nie wydałeś realnych pieniędzy na nikotynę. To konkret, nie abstrakcja.`,
        `Uzależnienie mówi: „jeden nie liczy się". Rok mówi co innego. Patrz na licznik.`,
        `Przenieś cenę jednej paczki do „funduszu wolności".`,
      ],
    },
    {
      title: "Mit: papieros koi stres",
      excerpt: "Nikotyna tworzy napięcie, potem je maskuje.",
      body: (d) => [
        `Dzień ${d}: poziom stresu może spaść. Papieros gasił głód, który sam wywołał.`,
        `Narzędzia: sen, spacer, rozmowa, dziennik, zimna woda, rozciąganie.`,
        `Ciężki dzień ≠ powód do relapse. Użyj trybu emergency na stronie.`,
      ],
    },
  ],
};

function buildArticles(lang) {
  const topics = articleTopics[lang];
  const articles = [];
  for (let d = 1; d <= 365; d++) {
    const topic = topics[(d - 1) % topics.length];
    const cycle = Math.floor((d - 1) / topics.length);
    const title = cycle === 0 ? topic.title : `${topic.title} (${lang === "pl" ? "dzień" : "day"} ${d})`;
    articles.push({
      day: d,
      title,
      excerpt: topic.excerpt,
      paragraphs: topic.body(d),
    });
  }
  return articles;
}

mkdirSync(outDir, { recursive: true });

for (const lang of ["en"]) {
  writeFileSync(
    join(outDir, `daily-quotes.${lang}.json`),
    JSON.stringify(buildQuotes(lang)),
    "utf8",
  );
  writeFileSync(
    join(outDir, `daily-articles.${lang}.json`),
    JSON.stringify(buildArticles(lang), null, 2),
    "utf8",
  );
}

console.log("Generated EN daily quotes and articles (365 each).");
