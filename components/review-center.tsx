"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CircleCheck, Clock3 } from "lucide-react";
import { lessons } from "@/lib/curriculum";
import { updateGuest, useGuest } from "@/lib/guest";
import { problems } from "@/lib/problems";
import { dueReviews, mistakeCategories } from "@/lib/revision";
import type { MistakeCategory } from "@/lib/revision";

export function ReviewCenter() {
  const {reviews,mistakes} = useGuest();
  const [now,setNow] = useState(() => Date.now());
  const [saved,setSaved] = useState("");
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick,60_000);
    window.addEventListener("focus",tick);
    return () => {window.clearInterval(timer);window.removeEventListener("focus",tick);};
  }, []);

  const due = new Set(dueReviews(reviews,now).map(([id]) => id));
  const cards = lessons.filter(lesson => reviews[lesson.id]).sort((a,b) => reviews[a.id].dueAt - reviews[b.id].dueAt);
  const entries = Object.entries(mistakes).sort(([,left],[,right]) => right.updatedAt-left.updatedAt);

  function save(event: React.FormEvent<HTMLFormElement>,id: string) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const category = String(data.get("category")) as MistakeCategory;
    if (!mistakeCategories.includes(category)) return;
    updateGuest(profile => ({...profile,mistakes:{...profile.mistakes,[id]:{...profile.mistakes[id],category,note:String(data.get("note") ?? "").trim().slice(0,500)}}}));
    setSaved(id);
  }

  return <div className="review-grid">
    <section className="surface"><h2>Revision queue</h2><p>Missed predictions are due immediately. Correct reviews move from 1 day to 3, 7, 14, and 30 days.</p>
      {cards.length ? <ul className="review-list">{cards.map(lesson => <li key={lesson.id}><div><strong>{lesson.title}</strong><span className={due.has(lesson.id) ? "review-due" : ""}>{due.has(lesson.id) ? <Clock3 size={15}/> : <CircleCheck size={15}/>} {due.has(lesson.id) ? "Due now" : `Next review ${new Date(reviews[lesson.id].dueAt).toLocaleDateString()}`}</span></div><Link className="button secondary" href={`/learn/${lesson.id}#prediction`}>Review <ArrowRight size={16}/></Link></li>)}</ul> : <Link className="text-link" href="/learn"><BookOpen size={16}/> Try a lesson prediction</Link>}
    </section>
    <section className="surface notebook"><h2>Mistake notebook</h2>{entries.length === 0 && <p>Missed predictions and failed submissions will appear here. Add your own explanation to each entry.</p>}
      {entries.map(([id,mistake]) => {
        const lesson = lessons.find(item => item.id === id);
        const problem = problems.find(item => item.id === id);
        return <form key={id} onSubmit={event => save(event,id)}>
          <h3>{lesson?.title ?? problem?.title ?? id}</h3><p>{mistake.reason}</p>
          <label>Category<select name="category" defaultValue={mistake.category}>{mistakeCategories.map(category => <option key={category}>{category}</option>)}</select></label>
          <label>Your note<textarea name="note" rows={3} maxLength={500} defaultValue={mistake.note}/></label>
          <div><button type="submit" className="button secondary">Save note</button> <span role="status" className="success">{saved === id && "Saved"}</span></div>
        </form>;
      })}
    </section>
  </div>;
}
