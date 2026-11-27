"use client";

import { useState } from "react";
import type { WorkedStep } from "@/lib/lessons/define";

export function WorkedTrace({steps}: {steps: WorkedStep[]}) {
  const [index,setIndex] = useState(0);
  const step = steps[index];
  if (!step) return null;

  return <section className="surface">
    <h2>Trace the example</h2>
    <div aria-live="polite" aria-atomic="true">
      <p>Step {index+1} of {steps.length}</p>
      <pre>{step.state}</pre>
      <p>{step.explanation}</p>
    </div>
    <div className="trace-controls">
      <button className="button secondary" type="button" disabled={index === 0} onClick={() => setIndex(index-1)}>Previous step</button>
      <button className="button secondary" type="button" disabled={index === steps.length-1} onClick={() => setIndex(index+1)}>Next step</button>
    </div>
  </section>;
}
