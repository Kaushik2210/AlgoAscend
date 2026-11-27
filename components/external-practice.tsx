"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { externalPractice } from "@/lib/external-practice";
import { updateGuest, useGuest } from "@/lib/guest";

export function ExternalPractice() {
  const {externalCompleted} = useGuest();

  return <>
    <p className="external-count" aria-live="polite">{externalCompleted.length} of {externalPractice.length} marked complete in this browser</p>
    <div className="external-grid">
      {externalPractice.map(item => {
        const done = externalCompleted.includes(item.id);
        return <article className="surface external-card" key={item.id}>
          <div className="eyebrow">{item.platform} · {item.topic}</div>
          <h2>{item.title}</h2><p>{item.prompt}</p>
          <div><a className="text-link" href={item.href} target="_blank" rel="noreferrer">Open on {item.platform} <ArrowUpRight size={16} aria-hidden="true"/></a>
          <Link className="text-link" href={`/learn/${item.lesson}`}>Review the lesson</Link></div>
          <button className={`button secondary ${done ? "external-complete" : ""}`} aria-label={`Mark ${item.title} complete`} aria-pressed={done} type="button" onClick={() => updateGuest(profile => ({
            ...profile,externalCompleted:done ? profile.externalCompleted.filter(id => id !== item.id) : [...profile.externalCompleted,item.id],
          }))}>{done && <CheckCircle2 size={16} aria-hidden="true"/>}{done ? "Marked complete" : "Mark complete"}</button>
        </article>;
      })}
    </div>
  </>;
}
