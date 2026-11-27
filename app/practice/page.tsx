import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { ConstraintAnalyzer } from "@/components/constraint-analyzer";
import { problems } from "@/lib/problems";

export default function Practice() {
  return <div className="shell inner-page"><div className="section-marker eyebrow"><Terminal size={16}/> PRACTICE</div><h1>Make the idea work.</h1><p className="lede">Choose a challenge and reason through the constraints before implementing a solution.</p><div className="feature-grid">{problems.map(problem => <article className="feature challenge-card" key={problem.id}><div className="eyebrow">{problem.topic}</div><h3>{problem.title}</h3><p>{problem.description}</p><Link href={`/practice/${problem.id}`}>Open challenge <ArrowRight size={16}/></Link></article>)}</div><ConstraintAnalyzer/></div>;
}
