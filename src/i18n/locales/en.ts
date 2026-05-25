type EmergencyReason = { title: string; body: string };

export type Dictionary = {
  meta: { title: string; description: string };
  language: { label: string; en: string; pl: string };
  auth: Record<string, string>;
  dashboard: Record<string, string>;
  counter: Record<string, string>;
  health: Record<string, string>;
  stats: Record<string, string>;
  footer: Record<string, string>;
  daily: Record<string, string>;
  onboarding: Record<string, string>;
  settings: Record<string, string>;
  profileForm: Record<string, string>;
  emergency: {
    title: string;
    close: string;
    slipped: string;
    breathingGuide: string;
    timerLabel: string;
    breatheIn: string;
    hold: string;
    breatheOut: string;
    reasons: EmergencyReason[];
  };
  relapse: {
    title: string;
    doneTitle: string;
    confirm: string;
    cancel: string;
    close: string;
    saving: string;
    saveFailed: string;
    confirmHint: string;
    noResetHint: string;
    counterUnchanged: string;
    noteLabel: string;
    notePlaceholder: string;
    logTitle: string;
    logLoading: string;
    slipped: string;
    encouragement: string[];
  };
};

export const en: Dictionary = {
  meta: {
    title: "fakksmoking — quit tracker",
    description: "Track days without nicotine, healing progress, and emergency craving support.",
  },
  language: {
    label: "Language",
    en: "English",
    pl: "Polski",
  },
  auth: {
    signIn: "Sign in",
    register: "Create account",
    signInHint: "Your quit date and progress are saved to your account.",
    registerHint: "Register once — track smoke-free days on any device.",
    nameOptional: "Name (optional)",
    email: "Email",
    password: "Password",
    pleaseWait: "Please wait…",
    noAccount: "No account?",
    hasAccount: "Already registered?",
    invalidCredentials: "Invalid email or password",
    signInAfterRegister: "Sign in failed after registration",
    registrationFailed: "Registration failed",
    somethingWrong: "Something went wrong",
  },
  dashboard: {
    settings: "Settings",
    wantToSmoke: "I want to smoke",
    slipped: "I slipped",
    signOut: "Sign out",
    primaryActionsAria: "Crisis support actions",
  },
  counter: {
    label: "Days without nicotine",
    footer: "Keep going.",
    aria: "Days without nicotine",
  },
  health: {
    title: "Your body is healing",
  },
  stats: {
    aria: "Savings and progress",
    moneySaved: "Money saved",
    moneyHint: "Not spent on cigarettes",
    notSmoked: "Not smoked",
    notSmokedHint: "Cigarettes avoided",
    timeSaved: "Time saved",
    timeHint: "~5 min per cigarette",
    lifeReclaimed: "Life reclaimed",
    lifeHint: "Estimated health time",
  },
  footer: {
    brand: "BUCCI STUDIO",
    center: "No nicotine. No excuses.",
    right: "You are smoke free",
  },
  daily: {
    quoteEyebrow: "Day {day} · thought of the day",
    articleEyebrow: "Article of the day · {day} / 365",
  },
  onboarding: {
    setupTitle: "Set up your tracker",
    habitsTitle: "Your smoking habits",
    setupDesc:
      "Quit date plus how much you smoked — we'll calculate money saved and cigarettes avoided.",
    habitsDesc: "We need your daily amount and pack price to show savings.",
    save: "Save and continue",
    saving: "Saving…",
    networkError: "Network error",
    saveFailed: "Could not save profile",
  },
  settings: {
    title: "Settings",
    close: "Close",
    save: "Save changes",
    saving: "Saving…",
    saveFailed: "Could not save",
    slipped: "I slipped",
  },
  profileForm: {
    quitDate: "Quit date",
    cigarettesPerDay: "Cigarettes per day",
    pricePerPack: "Price per pack",
    cigarettesPerPack: "Cigarettes in pack",
    currency: "Currency",
  },
  emergency: {
    title: "Ride it out",
    close: "Close",
    slipped: "I slipped — log it",
    breathingGuide: "Box breathing — 4-4-6",
    timerLabel: "Until the craving usually fades",
    breatheIn: "Breathe in",
    hold: "Hold",
    breatheOut: "Breathe out",
    reasons: [
      {
        title: "Cravings peak in minutes",
        body: "Most urges last 3–5 minutes. Wait them out — you already started the timer.",
      },
      {
        title: "One cigarette resets healing",
        body: "CO levels, circulation, and lung recovery slide backward. Your progress bar isn't cosmetic.",
      },
      {
        title: "Stress doesn't need smoke",
        body: "Nicotine only relieved withdrawal it caused. Breathing breaks the loop without poison.",
      },
      {
        title: "You chose a quit date for a reason",
        body: "Remember why you started. That reason didn't expire in the last ten minutes.",
      },
    ],
  },
  relapse: {
    title: "Log a slip",
    doneTitle: "Logged — keep going",
    confirm: "Log slip",
    cancel: "Cancel",
    close: "Close",
    saving: "Saving…",
    saveFailed: "Could not log slip",
    confirmHint: "Be honest with yourself. A short note can help you spot patterns later.",
    noResetHint:
      "This does not change your quit date or day counter. To restart your counter, set a new quit date in Settings.",
    counterUnchanged:
      "Your smoke-free day count is unchanged. One slip does not erase the days you already won.",
    noteLabel: "Note (optional)",
    notePlaceholder: "What triggered it? How did you feel?",
    logTitle: "Relapse log",
    logLoading: "Loading…",
    slipped: "I slipped",
    encouragement: [
      "One slip doesn't erase your progress — every smoke-free day still counts.",
      "You noticed and logged it. That honesty is part of recovery.",
      "Cravings lie. You chose to quit for real reasons — those reasons are still true.",
      "Setbacks happen. What matters is what you do in the next hour.",
      "You're not starting from zero — you're continuing with more experience.",
      "Shame feeds the habit. Self-compassion feeds the quit.",
      "This moment is data, not destiny. Learn from it and move on.",
      "Your body is still healing from every day you didn't smoke.",
      "Many people slip and still quit for good. You're still in the fight.",
      "Breathe. Drink water. The urge will pass again — you've proved that before.",
      "Logging this took courage. Use it to plan your next win.",
      "Tomorrow you can wake up smoke-free again. Today isn't the last chapter.",
      "Progress isn't a straight line. You're still on the path.",
      "You didn't fail — you had a hard moment. Hard moments end.",
      "Reach out, walk, wait ten minutes. You don't need another cigarette to cope.",
    ],
  },
};
