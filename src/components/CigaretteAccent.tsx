"use client";

/** Decorative CSS cigarette — corner accent, non-interactive. */
export function CigaretteAccent() {
  return (
    <div className="cigarette-accent" aria-hidden="true">
      <div className="cigarette-accent__wisp cigarette-accent__wisp--1" />
      <div className="cigarette-accent__wisp cigarette-accent__wisp--2" />
      <div className="cigarette-accent__wisp cigarette-accent__wisp--3" />
      <div className="cigarette-accent__stick">
        <span className="cigarette-accent__paper" />
        <span className="cigarette-accent__filter" />
        <span className="cigarette-accent__ember" />
      </div>
    </div>
  );
}
