"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, ScanSearch } from "lucide-react";
import { evaluatePattern, patternChallenges } from "@/lib/patterns";
import { updateGuest, useGuest } from "@/lib/guest";

export function PatternDetective() {
  const {patternsSolved} = useGuest();
  const [index,setIndex] = useState(0);
  const [choice,setChoice] = useState("");
  const [checked,setChecked] = useState("");
  const challenge = patternChallenges[index];
  const result = evaluatePattern(challenge.id,checked);
  const last = index === patternChallenges.length-1;

  function select(next: number) {
    setIndex(next);
    setChoice("");
    setChecked("");
  }

  function check(event: React.FormEvent) {
    event.preventDefault();
    setChecked(choice);
    if (evaluatePattern(challenge.id,choice)?.correct) {
      updateGuest(profile => ({...profile,patternsSolved:[...new Set([...profile.patternsSolved,challenge.id])]}));
    }
  }

  return <div className="detective-grid">
    <aside className="surface detective-list" aria-label="Pattern challenges">
      <h2>Cases</h2>
      <p>{patternsSolved.length} of {patternChallenges.length} solved</p>
      {patternChallenges.map((item,position) => {
        const Icon = patternsSolved.includes(item.id) ? CheckCircle2 : Circle;
        return <button type="button" key={item.id} aria-pressed={position === index} onClick={() => select(position)}>
          <Icon size={17} aria-hidden="true"/><span>{item.title}</span>
          {patternsSolved.includes(item.id) && <span className="sr-only">Solved</span>}
        </button>;
      })}
    </aside>
    <section className="surface detective-case">
      <div className="eyebrow"><ScanSearch size={15} aria-hidden="true"/> CHOOSE AN APPROACH</div>
      <h2>{challenge.title}</h2>
      <p>{challenge.prompt}</p>
      <p><strong>Constraints.</strong> {challenge.constraint}</p>
      <form className="quiz" onSubmit={check}>
        <fieldset>
          <legend>Which approach fits best?</legend>
          {challenge.options.map(option => <label key={option.id}>
            <input type="radio" name="approach" checked={choice === option.id} onChange={() => setChoice(option.id)}/>{option.label}
          </label>)}
        </fieldset>
        <button type="submit" className="button primary" disabled={!choice || checked === choice}>Check approach</button>
      </form>
      <div className="detective-feedback" aria-live="polite">{result && <>
        <strong className={result.correct ? "success" : "over-budget"}>{result.correct ? "That approach fits" : "Try a different approach"}</strong>
        <p>{result.explanation}</p>
        {result.correct && <p>{challenge.followUp}</p>}
      </>}</div>
      {result?.correct && (last
        ? <Link className="text-link" href="/practice">Back to practice <ArrowRight size={16} aria-hidden="true"/></Link>
        : <button type="button" className="button secondary" onClick={() => select(index+1)}>Next case <ArrowRight size={16} aria-hidden="true"/></button>)}
    </section>
  </div>;
}
