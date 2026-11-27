"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { experiences, goals, languageNames } from "@/lib/curriculum";
import type { Experience, Goal, Language } from "@/lib/curriculum";
import { updateGuest, useGuest } from "@/lib/guest";

export function Setup({language, goal}: {language?: Language; goal?: Goal}) {
  const guest = useGuest();
  const router = useRouter();
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    updateGuest(profile => ({ ...profile, language: data.get("language") as Language, goal: data.get("goal") as Goal, experience: data.get("experience") as Experience, minutes: Number(data.get("minutes")) }));
    router.push("/learn");
  }
  return <form className="surface setup-form" onSubmit={save} key={`${guest.language}/${guest.goal}/${guest.experience}/${guest.minutes}`}>
    <label>Primary language<select name="language" defaultValue={language ?? guest.language}>{Object.entries(languageNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label>Programming experience<select name="experience" defaultValue={guest.experience}>{Object.entries(experiences).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label>Learning goal<select name="goal" defaultValue={goal ?? guest.goal}>{Object.entries(goals).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label>Daily time budget<select name="minutes" defaultValue={guest.minutes}>{[10,15,25,40,60].map(minutes => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
    <div className="setup-footer"><p>Guest progress stays in this browser.</p><button className="button primary" type="submit">Open my roadmap <ArrowRight size={17}/></button></div>
  </form>;
}
