"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const formats = { coding: 1800, behavioral: 120 } as const;
type Format = keyof typeof formats;

const prompts = {
  setback: { label: "A setback", question: "Tell me about a time a project fell short. What did you do next?" },
  feedback: { label: "Difficult feedback", question: "Tell me about difficult feedback you received and what changed after you acted on it." },
  disagreement: { label: "A disagreement", question: "Tell me about a disagreement on a team. How did you work through it?" },
  tradeoff: { label: "A trade-off", question: "Describe a time you traded scope, speed, or quality. How did you make and communicate the decision?" },
} as const;
type Prompt = keyof typeof prompts;

function secondsUntil(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export function InterviewRehearsal({mocks}: {mocks: {id: string; title: string; problem: string}[]}) {
  const [format, setFormat] = useState<Format>("coding");
  const [prompt, setPrompt] = useState<Prompt>("setback");
  const [drafts, setDrafts] = useState<Partial<Record<Prompt, string>>>({});
  const [seconds, setSeconds] = useState<number>(formats.coding);
  const [deadline, setDeadline] = useState<number | null>(null);

  useEffect(() => {
    if (deadline === null) return;
    const timer = window.setInterval(() => {
      const left = secondsUntil(deadline);
      setSeconds(left);
      if (left === 0) setDeadline(null);
    }, 250);
    return () => window.clearInterval(timer);
  }, [deadline]);

  function reset(nextFormat: Format) {
    setDeadline(null);
    setSeconds(formats[nextFormat]);
  }

  function toggleTimer() {
    if (deadline === null) {
      setDeadline(Date.now() + seconds * 1000);
    } else {
      setSeconds(secondsUntil(deadline));
      setDeadline(null);
    }
  }

  const minutesText = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsText = String(seconds % 60).padStart(2, "0");
  const timerAction = deadline !== null ? "Pause timer" : seconds < formats[format] && seconds > 0 ? "Resume timer" : "Start timer";

  return <div className="lesson-grid rehearsal-grid">
    <section className="surface rehearsal-session" aria-labelledby="rehearsal-session-title">
      <h2 id="rehearsal-session-title">Practice session</h2>
      <label>Rehearsal format
        <select value={format} onChange={event => {
          const nextFormat = event.target.value as Format;
          setFormat(nextFormat);
          reset(nextFormat);
        }}>
          <option value="coding">Coding mock · 30 minutes</option>
          <option value="behavioral">Behavioral answer · 2 minutes</option>
        </select>
      </label>
      <p className="rehearsal-clock" role="timer" aria-label="Time remaining">{minutesText}:{secondsText}</p>
      <div className="rehearsal-actions">
        <button className="button primary" type="button" onClick={toggleTimer} disabled={seconds === 0}>{timerAction}</button>
        <button className="button secondary" type="button" onClick={() => reset(format)} disabled={seconds === formats[format] && deadline === null}>Reset timer</button>
      </div>
      <div role="status">{seconds === 0 ? "Time is up. Review your response." : ""}</div>
    </section>
    {format === "coding" ? <section className="surface" aria-labelledby="coding-rehearsal-title">
      <h2 id="coding-rehearsal-title">Coding mock</h2>
      <ol className="rehearsal-steps">
        <li><strong>4 minutes.</strong> Clarify the contract and work an example.</li>
        <li><strong>6 minutes.</strong> Explain a baseline and choose an approach.</li>
        <li><strong>12 minutes.</strong> Implement while explaining key decisions.</li>
        <li><strong>8 minutes.</strong> Run edge cases and state complexity.</li>
      </ol>
      <p>Challenges open in a new tab so your timer keeps running.</p>
      <ul className="rehearsal-links">{mocks.map(mock => <li key={mock.id}>
        <Link className="text-link" href={`/practice/${mock.problem}`} target="_blank" rel="noopener noreferrer">{mock.title}</Link>
      </li>)}</ul>
      <details>
        <summary>Review the worked solutions</summary>
        <ul className="rehearsal-links">{mocks.map(mock => <li key={mock.id}>
          <Link className="text-link" href={`/learn/${mock.id}`}>{mock.title}</Link>
        </li>)}</ul>
      </details>
    </section> : <section className="surface rehearsal-answer" aria-labelledby="behavioral-rehearsal-title">
      <h2 id="behavioral-rehearsal-title">Behavioral answer</h2>
      <label>Behavioral prompt
        <select value={prompt} onChange={event => setPrompt(event.target.value as Prompt)}>
          {Object.entries(prompts).map(([id, value]) => <option key={id} value={id}>{value.label}</option>)}
        </select>
      </label>
      <p className="rehearsal-question">{prompts[prompt].question}</p>
      <label>Your practice notes
        <textarea rows={5} maxLength={1200} value={drafts[prompt] ?? ""} onChange={event => {
          const value = event.target.value;
          setDrafts(previous => ({...previous, [prompt]: value}));
        }}/>
      </label>
      <details>
        <summary>Review your answer with STAR</summary>
        <ol className="rehearsal-steps">
          <li><strong>Situation.</strong> Give the context in one or two sentences.</li>
          <li><strong>Task.</strong> State what you were responsible for.</li>
          <li><strong>Action.</strong> Explain what you did and why.</li>
          <li><strong>Result.</strong> Describe the outcome and what you learned.</li>
        </ol>
      </details>
    </section>}
  </div>;
}
