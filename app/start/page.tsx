import { Compass } from "lucide-react";
import { Setup } from "@/components/setup";
import { goals, languageNames } from "@/lib/curriculum";
import type { Goal, Language } from "@/lib/curriculum";

export default async function Start({ searchParams }: { searchParams: Promise<{language?: string; goal?: string}> }) {
  const { language, goal } = await searchParams;
  return <div className="shell inner-page"><div className="section-marker eyebrow"><Compass size={16}/> YOUR LEARNING PATH</div><h1>Choose a starting point.</h1><p className="lede">Set your language and goals. You can change them anytime.</p><Setup language={Object.hasOwn(languageNames, language ?? "") ? language as Language : undefined} goal={Object.hasOwn(goals, goal ?? "") ? goal as Goal : undefined}/></div>;
}
