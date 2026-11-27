"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { RatingEntry } from "@/lib/codeforces";

export function CodeforcesHistory() {
  const [result,setResult] = useState<{handle: string; history: RatingEntry[]}>();
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  async function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const input = new FormData(event.currentTarget);
    const query = new URLSearchParams({handle:String(input.get("handle") ?? "")});
    setLoading(true);
    setError("");
    setResult(undefined);
    try {
      const response = await fetch(`/api/codeforces/rating?${query}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setResult(payload);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "The lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="surface rating-panel">
    <h2>Codeforces rating history</h2>
    <p>Look up the latest rated contests for a public handle.</p>
    <form className="trace-form" onSubmit={lookup}>
      <label>Codeforces handle<input name="handle" required maxLength={24} autoComplete="off" spellCheck={false}/></label>
      <button className="button secondary" type="submit" disabled={loading}>Look up handle</button>
    </form>
    <div aria-live="polite">{loading && <p>Checking the Codeforces API…</p>}{error && <p className="error">{error}</p>}{result && <p className="rating-summary">{result.history.length ? `${result.handle} · Latest rating ${result.history[0].rating}` : `${result.handle} has no rated contests.`}</p>}</div>
    {result && <a className="text-link" href={`https://codeforces.com/profile/${encodeURIComponent(result.handle)}`} target="_blank" rel="noreferrer">Open Codeforces profile <ArrowUpRight size={16}/></a>}
    {!!result?.history.length && <ul className="rating-list">{result.history.map((entry,index) => <li key={entry.contestId}>
      <a className="text-link" href={`https://codeforces.com/contest/${entry.contestId}`} target="_blank" rel="noreferrer">{entry.contestName} <ArrowUpRight size={14}/></a>
      <span>Rank {entry.rank}</span>
      <span className={entry.delta < 0 ? "over-budget" : "success"}>{entry.delta > 0 ? "+" : ""}{entry.delta}</span>
      <strong>{entry.rating}{index === 0 ? <span className="sr-only"> latest rating</span> : null}</strong>
    </li>)}</ul>}
  </section>;
}
