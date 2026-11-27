import { notFound } from "next/navigation";
import { Terminal } from "lucide-react";
import { problems } from "@/lib/problems";
import { Workspace } from "@/components/workspace";

export default async function PracticeProblem({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const problem = problems.find(item => item.id === slug);
  if (!problem) notFound();
  return <div className="shell inner-page"><div className="section-marker eyebrow"><Terminal size={16}/> {problem.topic.toUpperCase()}</div><h1>{problem.title}</h1><Workspace problem={problem} judgeAvailable={Boolean(process.env.JUDGE0_URL)} mentorAvailable={Boolean(process.env.MENTOR_CHAT_URL && process.env.MENTOR_MODEL)}/></div>;
}
