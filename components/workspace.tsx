"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, CodeXml, Maximize2, Minimize2, Play, Send, Sparkles } from "lucide-react";
import { languageNames } from "@/lib/curriculum";
import type { Language } from "@/lib/curriculum";
import { ChallengeEditorial } from "./challenge-editorial";
import { MentorPanel } from "./mentor-panel";
import { starter } from "@/lib/problems";
import type { Problem } from "@/lib/problems";
import type { JudgeResult } from "@/lib/judge";
import { categoryForVerdict, recordMistake } from "@/lib/revision";
import { updateGuest, useGuest } from "@/lib/guest";

const CodeEditor = dynamic(() => import("./code-editor"), {ssr:false, loading:() => <p role="status">Loading editor…</p>});
const storageEvent = "algoascend-workspace";

function stored(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function save(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* The active editor remains available. */ }
  window.dispatchEvent(new Event(storageEvent));
}

function subscribe(listener: () => void) {
  const media = matchMedia("(prefers-color-scheme: light)");
  window.addEventListener(storageEvent,listener);
  window.addEventListener("storage",listener);
  window.addEventListener("algo-theme",listener);
  media.addEventListener("change",listener);
  return () => {
    window.removeEventListener(storageEvent,listener);
    window.removeEventListener("storage",listener);
    window.removeEventListener("algo-theme",listener);
    media.removeEventListener("change",listener);
  };
}

export function Workspace({problem, judgeAvailable, mentorAvailable}: {problem: Problem; judgeAvailable: boolean; mentorAvailable: boolean}) {
  const guest = useGuest();
  const [language, setLanguage] = useState<Language | null>(null);
  const current = language ?? guest.language;
  const draftKey = `algoascend-draft/${problem.id}/${current}`;
  const notesKey = `algoascend-notes/${problem.id}`;
  const historyKey = `algoascend-history/${problem.id}`;
  const draft = useSyncExternalStore(subscribe,() => stored(draftKey),() => null);
  const notes = useSyncExternalStore(subscribe,() => stored(notesKey),() => null);
  const history = useSyncExternalStore(subscribe,() => stored(historyKey),() => null);
  const light = useSyncExternalStore(subscribe,() => document.documentElement.dataset.theme === "light" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: light)").matches),() => false);
  const [fallback, setFallback] = useState<Partial<Record<Language,string>>>({});
  const [notesFallback, setNotesFallback] = useState<string>();
  const [input, setInput] = useState(problem.sample.stdin);
  const [hint, setHint] = useState(0);
  const [focus, setFocus] = useState(false);
  const [split, setSplit] = useState(44);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<JudgeResult | null>(null);
  const code = draft ?? fallback[current] ?? starter[current];

  function edit(value: string) {
    setFallback(previous => ({...previous,[current]:value}));
    save(draftKey,value);
  }

  async function execute(mode: "run" | "submit") {
    if (checking || !code.trim()) return;
    setChecking(true);
    setResult(null);
    setError("");
    try {
      const response = await fetch("/api/judge",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({problemId:problem.id,language:current,source:code,stdin:input,mode})});
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setResult(payload);
      if (mode === "submit") {
        save(historyKey,[`${new Date().toLocaleString()} · ${languageNames[current]} · ${payload.verdict}`,...(stored(historyKey) ?? "").split("\n").filter(Boolean)].slice(0,10).join("\n"));
        if (payload.verdict === "Accepted") updateGuest(profile => ({...profile,solved:[...new Set([...profile.solved,problem.id])]}));
        const category = categoryForVerdict(payload.verdict);
        if (category) updateGuest(profile => ({...profile,mistakes:{...profile.mistakes,[problem.id]:recordMistake(profile.mistakes[problem.id],payload.verdict,Date.now(),category)}}));
      }
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to reach the judge.");
    } finally {
      setChecking(false);
    }
  }

  return <>
    <div className="workspace-top"><Link className="text-link" href="/practice"><ArrowLeft size={16}/> Challenge library</Link><button className="button secondary" type="button" onClick={() => setFocus(!focus)}>{focus ? <Minimize2 size={16}/> : <Maximize2 size={16}/>} {focus ? "Exit focus mode" : "Focus mode"}</button></div>
    {!focus && <label className="split-control">Panel width<input type="range" min="34" max="58" value={split} onChange={event => setSplit(Number(event.target.value))}/></label>}
    <div className={`workspace-grid ${focus ? "focused" : ""}`} style={{"--split":`${split}fr`,"--remaining":`${100-split}fr`} as React.CSSProperties}>
      {!focus && <div className="lesson-stack">
        <section className="surface"><h2>Problem statement</h2><p>{problem.description}</p><p>{problem.format}</p><p><strong>Constraints.</strong> {problem.constraints}</p><div className="samples"><div><h3>Sample input</h3><pre>{problem.sample.stdin}</pre></div><div><h3>Sample output</h3><pre>{problem.sample.expected}</pre></div></div></section>
        <section className="surface"><h2>Think Before You Code</h2><ol className="thinking-list"><li>Restate the input and output in your own words.</li><li>Work through a tiny example and an edge case.</li><li>Compare the simplest approach with one that fits the constraints.</li><li>Explain why it works, then implement and test.</li></ol><label>Personal notes<textarea value={notesFallback ?? notes ?? ""} rows={4} onChange={event => {setNotesFallback(event.target.value);save(notesKey,event.target.value);}}/></label></section>
        <section className="surface"><h2>Progressive hints</h2>{problem.hints.slice(0,hint).map((text,index) => <p key={text}><strong>Hint {index+1}.</strong> {text}</p>)}{hint < problem.hints.length && <button className="button secondary" type="button" onClick={() => setHint(hint+1)}><Sparkles size={16}/> {hint ? "Reveal next hint" : "Reveal a hint"}</button>}<Link className="text-link" href={`/learn/${problem.lesson}`}>Review the lesson</Link></section>
        <ChallengeEditorial problem={problem}/><MentorPanel available={mentorAvailable} problemId={problem.id} language={current}/><section className="surface"><h2>Submission history</h2><Link className="text-link" href="/review">Open mistake notebook</Link>{history ? <ul>{history.split("\n").map((entry,index) => <li key={index}>{entry}</li>)}</ul> : <p>Your submissions will appear here.</p>}</section>
      </div>}
      <div className="lesson-stack">
        <section className="surface workspace-editor"><div className="workspace-bar"><h2><CodeXml size={20}/> Source code</h2><label><span className="sr-only">Workspace language</span><select value={current} onChange={event => {setLanguage(event.target.value as Language);setResult(null);setError("");}} disabled={checking}>{Object.entries(languageNames).map(([id,name]) => <option key={id} value={id}>{name}</option>)}</select></label><details className="reset-control"><summary>Reset code</summary><button className="button secondary" type="button" onClick={event => {edit(starter[current]);event.currentTarget.closest("details")?.removeAttribute("open");}}>Restore starter</button></details></div><CodeEditor code={code} onChange={edit} language={current} light={light}/></section>
        <section className="surface"><h2>Run and submit</h2><label>Custom input<textarea rows={3} value={input} onChange={event => setInput(event.target.value)} spellCheck={false}/></label><div className="run-actions"><button type="button" className="button secondary" disabled={checking || !judgeAvailable || !code.trim()} onClick={() => execute("run")}><Play size={16}/> Run code</button><button type="button" className="button primary" disabled={checking || !judgeAvailable || !code.trim()} onClick={() => execute("submit")}><Send size={16}/> Submit code</button></div>
          <p>{judgeAvailable ? "Run or submit sends your source to the configured execution service." : "Code execution requires a configured sandbox or Judge0 service."}</p>
          <div aria-live="polite">{checking && <p>Waiting for the judge…</p>}{error && <p className="error">{error}</p>}{result && <div className="results"><h3>{result.verdict}</h3>{result.cases.map(item => <details key={item.label}><summary>{item.label} · {item.verdict}</summary>{item.expected !== undefined && <><p>Expected output</p><pre>{item.expected}</pre></>}{item.stdout !== undefined && <><p>Actual output</p><pre>{item.stdout || "(empty)"}</pre></>}{item.compileOutput && <pre>{item.compileOutput}</pre>}{item.stderr && <pre>{item.stderr}</pre>}{(item.time || item.memory != null) && <p>{[item.time && `${item.time} seconds`,item.memory != null && `${item.memory} KB`].filter(Boolean).join(" · ")}</p>}</details>)}</div>}</div>
        </section>
      </div>
    </div>
  </>;
}
