"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { estimateWork } from "@/lib/complexity";

const formatter = new Intl.NumberFormat("en");

export function ConstraintAnalyzer() {
  const [size, setSize] = useState(100_000);
  const [budget, setBudget] = useState(100_000_000);
  const estimates = estimateWork(size, budget);

  function update(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setSize(Number(fields.get("n")));
    setBudget(Number(fields.get("budget")));
  }

  return <details className="surface constraints-tool"><summary>Estimate what fits the constraints</summary>
    <p>Compare growth rates under an operation budget. These estimates assume a unit cost per operation. Runtime also depends on constants, input, and the language.</p>
    <form className="trace-form" onSubmit={update}>
      <label>Input size<input name="n" type="number" min="1" max="1000000000" required defaultValue={size}/></label>
      <label>Operation budget<select name="budget" defaultValue={budget}><option value="1000000">1 million</option><option value="10000000">10 million</option><option value="100000000">100 million</option><option value="1000000000">1 billion</option></select></label>
      <button type="submit" className="button secondary">Update estimates</button>
    </form>
    <table><caption>Estimates for n = {formatter.format(size)}</caption><thead><tr><th scope="col">Growth</th><th scope="col">Operations</th><th scope="col">Budget</th></tr></thead><tbody>{estimates.map(row => <tr key={row.kind}><th scope="row"><code>{row.kind}</code></th><td>{row.work === null ? "> 9 × 10¹⁵" : formatter.format(row.work)}</td><td className={row.fits ? "success" : "over-budget"}>{row.fits ? <Check size={15} aria-hidden="true"/> : <X size={15} aria-hidden="true"/>} {row.fits ? "Fits" : "Exceeds"}</td></tr>)}</tbody></table>
  </details>;
}
