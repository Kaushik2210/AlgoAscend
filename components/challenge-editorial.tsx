import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Problem } from "@/lib/problems";

export function ChallengeEditorial({problem}: {problem: Problem}) {
  const {editorial} = problem;
  return <section className="surface">
    <h2>Editorial</h2>
    <details className="editorial">
      <summary>Reveal the approach</summary>
      <div>
        <h3>Approach</h3>
        <p>{editorial.approach}</p>
        <h3>Why it works</h3>
        <p>{editorial.correctness}</p>
        <h3>Complexity</h3>
        <p>{editorial.complexity}</p>
        <h3>Edge cases to test</h3>
        <ul>{editorial.edgeCases.map(item => <li key={item}>{item}</li>)}</ul>
        <Link className="text-link" href={`/learn/${problem.lesson}#implementation`}>See the C, Python, and Java examples <ArrowUpRight size={16} aria-hidden="true"/></Link>
      </div>
    </details>
  </section>;
}
