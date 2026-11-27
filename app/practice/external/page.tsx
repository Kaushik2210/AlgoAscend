import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CodeforcesHistory } from "@/components/codeforces-history";
import { ExternalPractice } from "@/components/external-practice";

export default function ExternalPracticePage() {
  return <div className="shell inner-page">
    <Link className="text-link" href="/practice"><ArrowLeft size={16}/> Challenge library</Link>
    <div className="section-marker eyebrow"><ArrowUpRight size={16}/> EXTERNAL PRACTICE</div>
    <h1>Take the concept further.</h1>
    <p className="lede">Apply a lesson on another platform. Mark items complete here after practicing there.</p>
    <ExternalPractice/>
    <CodeforcesHistory/>
  </div>;
}
