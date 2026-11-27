"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Circle, CodeXml } from "lucide-react";
import { lessons } from "@/lib/curriculum";
import { useGuest } from "@/lib/guest";
import { problems } from "@/lib/problems";

export function LearningProgress() {
  const {completed,solved} = useGuest();
  return <section className="surface progress-board">
    <h2>Learning progress</h2>
    <p>{completed.length} of {lessons.length} lessons complete · {solved.length} of {problems.length} challenges solved</p>
    <ul>{lessons.map(lesson => {
      const done = completed.includes(lesson.id);
      const practiced = solved.includes(lesson.problem);
      return <li key={lesson.id}>
        <Link href={`/learn/${lesson.id}`}>{done ? <CheckCircle2 className="success" size={16}/> : <Circle size={16}/>} {lesson.title}</Link>
        <span className={practiced ? "success" : ""}><CodeXml size={15}/> {practiced ? "Challenge solved" : done ? "Ready for practice" : "Lesson available"}</span>
        <Link className="icon-button" href={`/practice/${lesson.problem}`} aria-label={`Practice ${lesson.title}`}><ArrowUpRight size={16}/></Link>
      </li>;
    })}</ul>
  </section>;
}
