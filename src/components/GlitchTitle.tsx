"use client";

export const SITE_BRAND = "fakksmoking";

export function GlitchTitle({ text = SITE_BRAND }: { text?: string }) {
  return (
    <h1 className="glitch-title" data-text={text}>
      <span className="glitch-title__text glitch-title__text--base">{text}</span>
      <span className="glitch-title__text glitch-title__text--red" aria-hidden="true">
        {text}
      </span>
      <span className="glitch-title__text glitch-title__text--cyan" aria-hidden="true">
        {text}
      </span>
    </h1>
  );
}
