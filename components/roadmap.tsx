"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Compass } from "lucide-react";
import { goals, languageNames, lessons, recommendNext, stages } from "@/lib/curriculum";
import { LearningProgress } from "./learning-progress";
import { useGuest } from "@/lib/guest";

export function Roadmap() {
  const guest = useGuest();
  const next = recommendNext(guest.experience, guest.goal, guest.completed);
  return <div className="roadmap-grid">
    <div className="roadmap-list">{stages.map((stage, index) => {
      const available = lessons.filter(lesson => lesson.stage === index);
      return <details key={stage} open={index === (next?.stage ?? 0)}><summary><span className="stage-number">{String(index).padStart(2, "0")}</span> {stage}<span className="stage-status">{available.length ? `${available.length} ${available.length === 1 ? "lesson" : "lessons"}` : "Planned"}</span></summary>{available.length ? <ul>{available.map(lesson => {
        const completed = guest.completed.includes(lesson.id);
        return <li key={lesson.id}><Link href={`/learn/${lesson.id}`}>{completed ? <CheckCircle2 size={17} className="success"/> : <Circle size={17}/>}<span>{lesson.title}</span><span className="stage-status">{completed ? "Complete" : `${lesson.minutes} min`}</span></Link></li>;
      })}</ul> : <p>Lessons for this stage are in development.</p>}</details>;
    })}</div>
    <div className="lesson-stack"><aside className="surface"><div className="eyebrow"><Compass size={16}/> UP NEXT</div><h2>{next?.title ?? "Published path complete"}</h2><p>{next?.objective ?? "Revisit the lab or try another language in practice."}</p><p>{languageNames[guest.language]} · {goals[guest.goal]} · {guest.minutes} min/day</p><p>{guest.completed.length} of {lessons.length} published lessons complete.</p><Link className="button primary" href={next ? `/learn/${next.id}` : "/practice"}>{next ? "Open lesson" : "Open practice"} <ArrowRight size={16}/></Link><Link className="text-link" href="/start">Edit learning preferences</Link><Link className="text-link" href="/learn/interview">Interview rehearsal</Link><Link className="text-link revision-link" href="/review">Review predictions and mistakes</Link></aside><LearningProgress/></div>
  </div>;
}
