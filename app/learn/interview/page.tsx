import Link from "next/link";
import { Timer } from "lucide-react";
import { InterviewRehearsal } from "@/components/interview-rehearsal";
import { lessons } from "@/lib/curriculum";

export default function InterviewPage() {
  const mocks = lessons
    .filter(lesson => lesson.stage === 14 && lesson.minutes === 30)
    .map(({id, title, problem}) => ({id, title, problem}));
  return <div className="shell inner-page">
    <div className="section-marker eyebrow"><Timer size={16} aria-hidden="true"/> INTERVIEW PREP</div>
    <h1>Rehearse your interview.</h1>
    <p className="lede">Run a coding mock or practice a two-minute behavioral answer.</p>
    <InterviewRehearsal mocks={mocks}/>
    <Link className="text-link" href="/learn">Back to the roadmap</Link>
  </div>;
}
