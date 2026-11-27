import { Map } from "lucide-react";
import { Roadmap } from "@/components/roadmap";

export default function Learn() {
  return <div className="shell inner-page"><div className="section-marker eyebrow"><Map size={16}/> ROADMAP</div><h1>Your learning route.</h1><p className="lede">Start with a recommendation or explore any stage. More topics are in development.</p><Roadmap/></div>;
}
