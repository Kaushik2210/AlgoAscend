import Link from "next/link";
import { FlaskConical, ArrowUpRight } from "lucide-react";
import { TracePanel } from "@/components/trace-panel";

export default async function Lab({searchParams}: {searchParams: Promise<{algorithm?: string}>}) {
  const { algorithm } = await searchParams;
  return <div className="shell inner-page"><div className="section-marker eyebrow"><FlaskConical size={16}/> VISUAL LAB</div><h1>Inspect every step.</h1><p className="lede">Edit an array, set a target, and see how each comparison changes the algorithm’s state.</p><div className="lab-grid"><TracePanel initial={algorithm === "bubble" ? "bubble" : "binary"}/><aside className="surface lab-notes"><h2>Try an experiment</h2><p>Search for a number that falls between two values. Which comparison tells you it is missing?</p><p>Then try Bubble Sort with an already sorted array. Compare the operation count with the reverse order.</p><Link className="text-link" href="/learn/binary-search">Learn the reasoning <ArrowUpRight size={16}/></Link></aside></div></div>;
}
