"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { languageNames } from "@/lib/curriculum";
import type { Language, lessons } from "@/lib/curriculum";
import { TracePanel } from "./trace-panel";
import { recordMistake, recordReview } from "@/lib/revision";
import { updateGuest, useGuest } from "@/lib/guest";

export function LessonView({lesson}: {lesson: typeof lessons[number]}) {
  const guest = useGuest();
  const [answer, setAnswer] = useState<number | null>(null);
  const [graded, setGraded] = useState<number | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [operandA, setOperandA] = useState(4);
  const [operandB, setOperandB] = useState(8);
  const [output, setOutput] = useState<number | null>(null);
  const completed = guest.completed.includes(lesson.id);
  const codeLanguage = language ?? guest.language;

  function grade() {
    if (answer === null) return;
    const correct = answer === lesson.correct;
    const now = Date.now();
    setGraded(answer);
    updateGuest(profile => ({
      ...profile,
      completed: correct && !profile.completed.includes(lesson.id) ? [...profile.completed,lesson.id] : profile.completed,
      reviews:{...profile.reviews,[lesson.id]:recordReview(profile.reviews[lesson.id],correct,now)},
      mistakes:correct ? profile.mistakes : {...profile.mistakes,[lesson.id]:recordMistake(profile.mistakes[lesson.id],`Prediction: ${lesson.answers[answer]}`,now)},
    }));
  }

  return <div className="lesson-grid">
    <div className="lesson-stack">
      <section className="surface"><h2>The idea</h2><p><strong>Prerequisites.</strong> {lesson.prerequisites}</p><p>{lesson.analogy}</p><p>{lesson.explanation}</p><details><summary>Why it works</summary><p>{lesson.formal}</p></details></section>
      <section className="surface" id="implementation"><h2>From pseudocode to implementation</h2><details><summary>Read the pseudocode</summary><pre>{lesson.pseudocode}</pre></details><label className="code-language">Implementation language<select value={codeLanguage} onChange={event => setLanguage(event.target.value as Language)}>{Object.entries(languageNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><pre><code>{lesson.code[codeLanguage]}</code></pre><p>{lesson.walkthrough}</p><p><strong>Time.</strong> {lesson.runtime} · <strong>Space.</strong> {lesson.memory}</p></section>
      <section className="surface"><h2>Debug and revise</h2><p>{lesson.debug}</p><p>{lesson.fill}</p><details><summary>Check your reasoning</summary><p>{lesson.mistakes}</p><p>{lesson.edge}</p><p>{lesson.revision}</p></details></section>
    </div>
    <div className="lesson-stack">
      <section className="surface quiz" id="prediction"><h2>Predict what happens</h2><fieldset><legend>{lesson.question}</legend>{lesson.answers.map((option, index) => <label key={option}><input type="radio" name="prediction" checked={answer === index} onChange={() => setAnswer(index)}/>{option}</label>)}</fieldset><button type="button" className="button primary" disabled={answer === null || answer === graded} onClick={grade}>Check prediction</button><div aria-live="polite" className="quiz-feedback">{graded !== null && (graded === lesson.correct ? <p className="success">{lesson.feedback}</p> : <p>Try again. Use the trace below to test your reasoning.</p>)}</div></section>
      {lesson.algorithm ? <TracePanel initial={lesson.algorithm}/> : <section className="surface"><h2>Trace the sum</h2><form className="sum-form" onSubmit={event => { event.preventDefault(); setOutput(operandA + operandB); }}><label>First integer<input type="number" required min="-10000" max="10000" value={operandA} onChange={event => {setOperandA(Number(event.target.value)); setOutput(null);}}/></label><label>Second integer<input type="number" required min="-10000" max="10000" value={operandB} onChange={event => {setOperandB(Number(event.target.value)); setOutput(null);}}/></label><button className="button secondary" type="submit">Show output</button></form><p aria-live="polite" className="sum-result">{output !== null && `Read ${operandA} and ${operandB}. Add the operands. Print ${output}.`}</p></section>}
      <section className="surface next-action">{completed && <p className="success"><CheckCircle2 size={16}/> Lesson complete</p>}<Link className="button primary" href={`/practice/${lesson.problem}`}>Practice this concept <ArrowRight size={16}/></Link><Link className="text-link" href="/learn">Back to roadmap</Link><Link className="text-link" href="/review">Revision and mistakes</Link></section>
    </div>
  </div>;
}
