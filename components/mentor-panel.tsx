"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Language } from "@/lib/curriculum";
import { mentorModes } from "@/lib/mentor";

export function MentorPanel({available, problemId, language}: {available: boolean; problemId: string; language: Language}) {
  const [answer,setAnswer] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setAnswer("");
    setError("");
    try {
      const result = await fetch("/api/mentor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({problemId,language,mode:form.get("mode"),question:form.get("question")})});
      const payload = await result.json();
      if (!result.ok) throw new Error(payload.error);
      setAnswer(payload.answer);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to reach AlgoMentor.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="surface mentor"><h2><Sparkles size={20} aria-hidden="true"/> AlgoMentor</h2>{available ? <>
    <p>Your typed question and the public challenge context go to the configured AI provider.</p>
    <form onSubmit={ask}>
      <label>Teaching mode<select name="mode">{Object.entries(mentorModes).map(([id,title]) => <option key={id} value={id}>{title}</option>)}</select></label>
      <label>Your question<textarea name="question" rows={3} maxLength={1200} required/></label>
      <button type="submit" className="button secondary" disabled={loading}>Ask AlgoMentor</button>
    </form>
    <div aria-live="polite">{loading && <p>Waiting for AlgoMentor…</p>}{error && <p className="error">{error}</p>}{answer && <div className="mentor-answer"><strong>AI-generated explanation</strong><p>{answer}</p></div>}</div>
  </> : <p>AI guidance is available when a tutor provider is configured. You can use the authored hints above anytime.</p>}</section>;
}
