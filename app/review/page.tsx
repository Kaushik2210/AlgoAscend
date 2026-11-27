import { NotebookPen } from "lucide-react";
import { ReviewCenter } from "@/components/review-center";

export default function ReviewPage() {
  return <div className="shell inner-page"><div className="section-marker eyebrow"><NotebookPen size={16}/> REVISION</div><h1>Revisit your reasoning.</h1><p className="lede">Review what slipped, and make a note for next time.</p><ReviewCenter/></div>;
}
