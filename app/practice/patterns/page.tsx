import Link from "next/link";
import { ArrowLeft, ScanSearch } from "lucide-react";
import { PatternDetective } from "@/components/pattern-detective";

export default function PatternsPage() {
  return <div className="shell inner-page">
    <Link className="text-link" href="/practice"><ArrowLeft size={16} aria-hidden="true"/> Challenge library</Link>
    <div className="section-marker eyebrow"><ScanSearch size={16} aria-hidden="true"/> PATTERN DETECTIVE</div>
    <h1>Read the clues first.</h1>
    <p className="lede">Choose the approach suggested by the problem and its constraints. Each choice gives you a reason to keep it or rule it out.</p>
    <PatternDetective/>
  </div>;
}
