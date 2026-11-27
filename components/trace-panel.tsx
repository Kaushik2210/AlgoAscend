"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Braces, ChevronDown, CircleDot, Pause, Play, RotateCcw } from "lucide-react";
import { accumulationTrace, binaryTrace, bubbleTrace, parseValues, traces } from "@/lib/trace";
import { SearchBattle } from "./search-battle";
import type { Algorithm, Frame } from "@/lib/trace";

function makeFrames(algorithm: Algorithm): Frame[] {
  if (algorithm === "binary") return binaryTrace(traces.binary.values,traces.binary.target);
  if (algorithm === "accumulate") return accumulationTrace(traces.accumulate.values);
  return bubbleTrace(traces.bubble.values);
}

export function TracePanel({ preview = false, initial = "binary", battle = false }: { preview?: boolean; initial?: Algorithm; battle?: boolean }) {
  const [algorithm, setAlgorithm] = useState<Algorithm>(initial);
  const [frames, setFrames] = useState(() => makeFrames(initial));
  const [index, setIndex] = useState(preview ? 1 : 0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [input, setInput] = useState(traces[initial].values.join(", "));
  const [target, setTarget] = useState(String(traces.binary.target));
  const [appliedTarget, setAppliedTarget] = useState(traces.binary.target);
  const [error, setError] = useState("");
  const frame = frames[index];
  const title = traces[algorithm].title;
  const last = index === frames.length - 1;
  const max = Math.max(1, ...frame.values.map(Math.abs));
  const middle = frame.active[0];
  const final = frames[frames.length - 1];
  const contrastingWindow = algorithm === "binary" ? "Search window" : algorithm === "bubble" ? "Unsorted window" : "Unread values";
  const activeLabel = algorithm === "binary" ? "Midpoint" : algorithm === "bubble" ? "Compared pair" : "Current item";

  useEffect(() => {
    if (!playing || last) return;
    const timer = window.setTimeout(() => {
      setIndex(index + 1);
      if (index + 1 === frames.length - 1) setPlaying(false);
    }, 850 / speed);
    return () => window.clearTimeout(timer);
  }, [playing, last, speed, index, frames.length]);

  function selectAlgorithm(next: Algorithm) {
    setAlgorithm(next);
    setFrames(makeFrames(next));
    setIndex(preview ? 1 : 0);
    setPlaying(false);
    setInput(traces[next].values.join(", "));
    setTarget(String(traces.binary.target));
    setAppliedTarget(traces.binary.target);
    setError("");
  }

  function applyInput(event: React.FormEvent) {
    event.preventDefault();
    try {
      const values = parseValues(input);
      const nextTarget = Number(target);
      if (algorithm === "binary" && !/^-?\d{1,3}$/.test(target.trim())) throw new Error("Enter an integer target between −999 and 999.");
      setFrames(algorithm === "binary" ? binaryTrace(values,nextTarget) : algorithm === "bubble" ? bubbleTrace(values) : accumulationTrace(values));
      setAppliedTarget(nextTarget);
      setIndex(0);
      setPlaying(false);
      setError("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Check the input values.");
    }
  }

  return (
    <div className={`trace-panel ${preview ? "trace-preview" : ""}`}>
      <div className="trace-top">
        <div className="trace-tab"><Braces size={18} aria-hidden="true"/> <span>Algorithm Explorer</span></div>
        <span className="live-label"><CircleDot size={12} aria-hidden="true"/> LIVE TRACE</span>
      </div>
      <div className="trace-content">
        {preview ? (
          <div className="trace-heading"><div><strong>{title}</strong><span className="trace-subtitle">Find a target in a sorted array</span></div><span className="complexity">{traces[algorithm].complexity}</span></div>
        ) : (
          <div className="trace-heading">
            <label className="select-wrap"><span className="sr-only">Algorithm</span><select value={algorithm} onChange={event => selectAlgorithm(event.target.value as Algorithm)}><option value="binary">Binary Search</option><option value="bubble">Bubble Sort</option><option value="accumulate">Running Total</option></select><ChevronDown size={15} aria-hidden="true"/></label>
            <span className="complexity">{traces[algorithm].complexity}</span>
          </div>
        )}
        <div className="plot" role="img" aria-label={`${title} array. ${frame.values.join(", ")}. ${frame.message}`}>
          <div className="plot-key"><span><i/> {contrastingWindow}</span><span><i/> {activeLabel}</span></div>
          <div className={`bars ${algorithm === "accumulate" ? "array-tiles" : ""}`} aria-hidden="true">
            {frame.values.map((value, position) => {
              const active = frame.active.includes(position);
              const outside = position < frame.low || position > frame.high;
              return <div className={`bar-column ${active ? "active" : ""} ${outside && !active ? "outside" : ""}`} key={position}>
                <span className="bar-value">{value}</span>{algorithm !== "accumulate" && <span className="bar" style={{ height: `${Math.round(13 + 82 * Math.abs(value) / max)}%` }}/>}<span className="bar-index">{position}</span>
              </div>;
            })}
          </div>
          <div className="plot-bottom"><span>INDEX</span>{algorithm === "binary" && <span>TARGET <b>{appliedTarget}</b></span>}{algorithm === "accumulate" && <span>RUNNING TOTAL <b>{frame.total}</b></span>}</div>
        </div>
        <div className="trace-message" aria-live={playing ? "off" : "polite"}><span className="message-pointer">↳</span><span>{frame.message}</span></div>
        <div className="trace-controls">
          <div className="transport">
            <button type="button" className="icon-button" aria-label="Restart trace" onClick={() => { setPlaying(false); setIndex(0); }}><RotateCcw size={17}/></button>
            <button type="button" className="icon-button" aria-label="Previous step" disabled={index === 0} onClick={() => { setPlaying(false); setIndex(index - 1); }}><ArrowLeft size={17}/></button>
            <button type="button" className="icon-button play-button" aria-label={playing ? "Pause trace" : "Play trace"} onClick={() => { if (last) setIndex(0); setPlaying(!playing); }}>{playing ? <Pause size={17}/> : <Play size={17}/>}</button>
            <button type="button" className="icon-button" aria-label="Next step" disabled={last} onClick={() => { setPlaying(false); setIndex(index + 1); }}><ArrowRight size={17}/></button>
          </div>
          <span className="step-counter">STEP {String(index + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}</span>
        </div>
        {!preview && <>
          <label className="scrubber">Timeline <input type="range" min="0" max={frames.length - 1} value={index} onChange={event => { setPlaying(false); setIndex(Number(event.target.value)); }}/></label>
          <form className="trace-form" onSubmit={applyInput}>
            <label>Array values<input value={input} onChange={event => setInput(event.target.value)} aria-describedby={error ? "trace-error" : undefined}/></label>
            {algorithm === "binary" && <label className="target-field">Target<input value={target} onChange={event => setTarget(event.target.value)} inputMode="text"/></label>}
            <button className="button secondary" type="submit">Apply input</button>
          </form>
          {error && <p id="trace-error" role="alert" className="error">{error}</p>}
          <div className="trace-details">
            <div><strong>Pseudocode</strong><ol className="pseudocode">{traces[algorithm].pseudocode.map((line, position) => <li key={line} aria-current={position === frame.line ? "step" : undefined}><code>{line}</code></li>)}</ol></div>
            <div><strong>Variables</strong><dl className="variables"><dt>low</dt><dd>{frame.low}</dd><dt>high</dt><dd>{frame.high}</dd><dt>{algorithm === "binary" ? "mid" : algorithm === "bubble" ? "left" : "index"}</dt><dd>{middle ?? "—"}</dd><dt>{algorithm === "accumulate" ? "additions" : "comparisons"}</dt><dd>{frame.operations}</dd></dl>
            <label>Speed<select value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div>
          </div>
          {battle && algorithm === "binary" && <SearchBattle values={final.values} target={appliedTarget} binaryCount={final.operations} match={final.result ?? -1}/> }
        </>}
      </div>
    </div>
  );
}
